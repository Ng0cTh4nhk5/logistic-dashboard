# Hướng Dẫn Deploy — Logistics Cost Dashboard

## Tổng Quan

Logistics Cost Dashboard là một **ứng dụng web tĩnh** (static site):
- **Không cần backend/server** — toàn bộ logic chạy trên trình duyệt
- **Dữ liệu lưu trong localStorage** — mỗi người dùng có data riêng trên trình duyệt của họ
- **Chỉ cần host file tĩnh** — HTML + CSS + JS + favicon

**Kích thước sau build:**

| File | Gốc | Gzip |
|------|-----|------|
| `index.html` | 0.83 KB | 0.46 KB |
| `assets/index-*.css` | 38.83 KB | 6.58 KB |
| `assets/index-*.js` | 298.60 KB | 94.58 KB |
| **Tổng** | **~339 KB** | **~102 KB** |

---

## Yêu Cầu

- **Node.js** ≥ 18 (chỉ cần để build, không cần trên server)
- Bất kỳ dịch vụ **static hosting** nào (xem các lựa chọn bên dưới)

---

## Bước 1: Build Production

```bash
# Clone repo (nếu chưa có)
git clone <repo-url>
cd cooking-oil-logistic

# Cài dependencies
npm install

# Build
npm run build
```

Sau khi build, thư mục `dist/` chứa tất cả file cần deploy:

```
dist/
├── index.html          # Entry point
├── favicon.svg         # Icon
├── icons.svg           # Sprite icons
└── assets/
    ├── index-*.css     # Toàn bộ CSS (minified)
    └── index-*.js      # Toàn bộ JS + Chart.js (minified)
```

> **Chỉ cần upload thư mục `dist/`** lên hosting. Không cần `node_modules`, `src`, hay bất kỳ file nào khác.

---

## Bước 2: Chọn Hosting

### Lựa Chọn A: GitHub Pages (Miễn phí — Khuyến nghị)

**Phù hợp**: Demo, chia sẻ link cho đồng nghiệp/giảng viên.

#### Cách 1: Deploy thủ công

```bash
# 1. Build
npm run build

# 2. Tạo branch gh-pages từ dist
cd dist
git init
git add -A
git commit -m "Deploy logistics dashboard"
git branch -M gh-pages
git remote add origin https://github.com/<username>/<repo>.git
git push -f origin gh-pages
```

Truy cập: `https://<username>.github.io/<repo>/`

#### Cách 2: GitHub Actions (Tự động deploy khi push)

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install & Build
        run: |
          npm ci
          npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

Sau khi push lên `main`, GitHub sẽ tự build và deploy.

> ⚠️ **Lưu ý**: Vào repo **Settings → Pages → Source** chọn **GitHub Actions**.

---

### Lựa Chọn B: Vercel (Miễn phí — Tự động)

```bash
# 1. Cài Vercel CLI
npm i -g vercel

# 2. Deploy (lần đầu sẽ hỏi config)
vercel

# 3. Deploy production
vercel --prod
```

Hoặc:
1. Truy cập [vercel.com](https://vercel.com)
2. Import repo từ GitHub
3. Vercel tự detect Vite → tự build + deploy
4. Mỗi lần push code, tự deploy lại

**URL**: `https://<project>.vercel.app`

---

### Lựa Chọn C: Netlify (Miễn phí)

```bash
# 1. Cài Netlify CLI
npm i -g netlify-cli

# 2. Build trước
npm run build

# 3. Deploy thư mục dist
netlify deploy --prod --dir=dist
```

Hoặc:
1. Truy cập [netlify.com](https://netlify.com)
2. Kéo thả thư mục `dist/` vào Netlify Drop
3. Xong — nhận link ngay lập tức

**URL**: `https://<project>.netlify.app`

---

### Lựa Chọn D: Cloudflare Pages (Miễn phí — Nhanh nhất)

1. Truy cập [dash.cloudflare.com](https://dash.cloudflare.com) → Pages
2. Connect GitHub repo
3. Cấu hình:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy

**URL**: `https://<project>.pages.dev`

---

### Lựa Chọn E: VPS / Server riêng (Nginx)

Nếu bạn có VPS (DigitalOcean, AWS EC2, v.v.):

```bash
# 1. Build trên máy local
npm run build

# 2. Upload dist lên server
scp -r dist/* user@your-server:/var/www/logistics-dashboard/

# 3. Cấu hình Nginx
```

File `/etc/nginx/sites-available/logistics-dashboard`:

```nginx
server {
    listen 80;
    server_name logistics.yourdomain.com;

    root /var/www/logistics-dashboard;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;

    # Cache static assets (CSS/JS có hash trong tên file, cache dài)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Favicon + icons
    location ~* \.(svg|ico)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # SPA fallback — tất cả routes trả về index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/logistics-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Thêm HTTPS với Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d logistics.yourdomain.com
```

---

### Lựa Chọn F: Mở file trực tiếp (Offline / USB)

Nếu bạn chỉ cần chạy offline trên máy tính hoặc từ USB:

```bash
npm run build
npm run preview
```

Mở `http://localhost:4173` — hoạt động bình thường.

> ⚠️ **Không thể** mở `dist/index.html` trực tiếp bằng `file://` vì ES module cần HTTP server. Dùng `npx serve dist` hoặc `npm run preview` thay thế.

---

## Cấu Hình Tuỳ Chọn

### Custom Domain

Với GitHub Pages, tạo file `public/CNAME`:

```
logistics.yourdomain.com
```

Với Vercel/Netlify/Cloudflare: thêm domain trong dashboard của dịch vụ.

### Base URL (nếu deploy vào subfolder)

Nếu app không nằm ở root (ví dụ: `https://example.com/dashboard/`), tạo file `vite.config.js`:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/dashboard/',
})
```

Rồi build lại: `npm run build`.

---

## Kiểm Tra Sau Deploy

| Mục | Cách kiểm tra |
|-----|---------------|
| Trang load thành công | Mở URL → thấy Welcome screen |
| Fonts load | Chữ hiển thị Inter, không phải font mặc định |
| Chart.js hoạt động | Load demo data → dashboard có biểu đồ |
| localStorage hoạt động | Nhập data → refresh trang → data còn |
| HTTPS hoạt động | URL bắt đầu bằng `https://` (trừ localhost) |
| Mobile responsive | Mở trên điện thoại → layout co giãn đúng |

---

## Lưu Ý Quan Trọng

> [!WARNING]
> **Dữ liệu lưu trong localStorage của trình duyệt.** Nếu người dùng xoá cache/data trình duyệt, dữ liệu sẽ mất. Ứng dụng có chức năng **Export/Import JSON** để backup.

> [!NOTE]
> **Không cần database, không cần API key, không cần biến môi trường.** App hoạt động độc lập 100%.

> [!TIP]
> **Để chia sẻ nhanh nhất**: Dùng **Netlify Drop** — kéo thả thư mục `dist/` vào [app.netlify.com/drop](https://app.netlify.com/drop) → có link trong 30 giây.
