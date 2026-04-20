# 📊 Hướng Dẫn Sử Dụng — Logistics Cost Dashboard

> **Phiên bản:** 2.0  
> **Cập nhật:** Tháng 4/2026  
> **Công nghệ:** Vite + Vanilla JavaScript (SPA)  
> **Lưu trữ dữ liệu:** localStorage (trình duyệt) — không cần server

---

## 📑 Mục Lục

1. [Tổng Quan](#1-tổng-quan)
2. [Cài Đặt & Khởi Chạy](#2-cài-đặt--khởi-chạy)
3. [Wizard Thiết Lập (6 Bước)](#3-wizard-thiết-lập-6-bước)
   - [Bước 1: Chào Mừng](#bước-1-chào-mừng)
   - [Bước 2: Thông Tin Công Ty](#bước-2-thông-tin-công-ty)
   - [Bước 3: Sản Phẩm](#bước-3-sản-phẩm)
   - [Bước 4: Mạng Lưới Cung Ứng](#bước-4-mạng-lưới-cung-ứng)
   - [Bước 5: Cấu Trúc Chi Phí](#bước-5-cấu-trúc-chi-phí)
   - [Bước 6: Tuỳ Chỉnh Dashboard](#bước-6-tuỳ-chỉnh-dashboard)
4. [Xem Lại & Khởi Động Dashboard](#4-xem-lại--khởi-động-dashboard)
5. [Dashboard — Bảng Điều Khiển](#5-dashboard--bảng-điều-khiển)
   - [KPI Cards](#5b-kpi-cards-4-thẻ-chỉ-số)
   - [Biểu đồ](#5c-biểu-đồ)
   - [Supply Chain Graph](#-supply-chain-graph-mạng-lưới-cung-ứng)
   - [Scenario Analysis](#-scenario-analysis-phân-tích-kịch-bản)
6. [Xuất / Nhập Dữ Liệu](#6-xuất--nhập-dữ-liệu)
7. [Câu Hỏi Thường Gặp (FAQ)](#7-câu-hỏi-thường-gặp-faq)

---

## 1. Tổng Quan

**Logistics Cost Dashboard** là ứng dụng web giúp doanh nghiệp **phân tích và trực quan hoá cơ cấu chi phí logistics** — bao gồm vận chuyển, kho bãi, xếp dỡ, hao hụt và quản lý.

### Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🧙 **Wizard 6 bước** | Nhập dữ liệu doanh nghiệp theo từng bước, dễ hiểu |
| 📊 **Dashboard tự động** | 4 KPI cards + 3 biểu đồ + SVG graph tự tính toán từ dữ liệu đã nhập |
| 🔗 **Supply Chain Graph** | Đồ thị SVG tương tác hiển thị mạng lưới nodes và routes (không cần toạ độ GPS) |
| 📈 **Scenario Analysis** | Mô phỏng "what-if" — kéo slider điều chỉnh nhóm chi phí, xem tác động real-time |
| 📦 **Demo Data** | Dữ liệu mẫu (ngành dầu ăn, USA) để trải nghiệm nhanh |
| 💾 **Import / Export** | Xuất/nhập file JSON để lưu trữ hoặc chia sẻ |
| 🔒 **Bảo mật** | Mọi dữ liệu nằm trên trình duyệt, không gửi đi đâu cả |

### Ngành hỗ trợ

Cooking Oil, FMCG, Food & Beverage, Chemical, Pharmaceutical, Agriculture, Retail, và nhiều ngành khác.

---

## 2. Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống

- **Node.js** phiên bản 16 trở lên
- **npm** (đi kèm Node.js)
- Trình duyệt hiện đại (Chrome, Firefox, Edge)

### Cài đặt

```bash
# 1. Clone hoặc giải nén source code
cd cooking-oil-logistic

# 2. Cài dependencies
npm install

# 3. Chạy development server
npm run dev
```

### Truy cập

Mở trình duyệt và truy cập:

```
http://localhost:5173
```

> 💡 **Mẹo:** Để build production, chạy `npm run build`. File output sẽ nằm trong thư mục `dist/`.

---

## 3. Wizard Thiết Lập (6 Bước)

Wizard hướng dẫn nhập dữ liệu từng bước. Bạn có thể quay lại bước trước bất kỳ lúc nào bằng nút **← Back** hoặc click vào thanh progress bar phía trên.

### Bước 1: Chào Mừng

Trang chào mừng giới thiệu ứng dụng và cho phép chọn một trong hai cách bắt đầu:

| Tuỳ chọn | Mô tả |
|-----------|-------|
| 🚀 **Start Fresh** | Bắt đầu từ đầu, tự nhập dữ liệu của doanh nghiệp bạn. Cần khoảng 5 phút. |
| 📦 **Load Demo Data** | Tải dữ liệu mẫu (công ty dầu ăn GoldenHarvest Foods, USA) và nhảy thẳng tới Dashboard. Phù hợp để xem trước giao diện. |

> 💡 **Khi nào dùng Demo Data?** Khi bạn muốn xem dashboard trông như thế nào trước khi nhập dữ liệu thật. Sau đó, bạn có thể vào **Settings** để chỉnh sửa.

---

### Bước 2: Thông Tin Công Ty

Nhập thông tin tổng quan về doanh nghiệp.

| Trường | Bắt buộc | Mô tả | Ví dụ |
|--------|----------|-------|-------|
| **Company Name** | ✅ Có | Tên công ty hoặc đơn vị logistics | `Dầu Ăn Tường An` |
| **Industry** | Không | Ngành nghề kinh doanh | `Cooking Oil / Edible Oil` |
| **Primary Country** | Không | Quốc gia hoạt động chính | `Vietnam` |
| **Company Scale** | Không | Quy mô: Small / Medium / Large / Enterprise | `Medium` |
| **Annual Revenue** | Không | Doanh thu hàng năm (dùng để tính % chi phí logistics) | `120000000000` |
| **Number of Employees** | Không | Tổng số nhân viên | `850` |
| **Distribution Channels** | Không | Kênh phân phối (chọn nhiều) | `Wholesale, Retail, E-commerce` |
| **Distribution Coverage** | Không | Phạm vi: Local / Regional / National / International / Global | `National` |

> ⚠️ **Lưu ý:** Chỉ **Company Name** là bắt buộc. Các trường khác giúp dashboard hiển thị thêm thông tin phân tích (ví dụ: tỷ lệ chi phí logistics trên doanh thu).

---

### Bước 3: Sản Phẩm

Liệt kê các sản phẩm mà doanh nghiệp vận chuyển/phân phối.

| Cột | Mô tả | Ví dụ |
|-----|-------|-------|
| **Product Name** | Tên sản phẩm | `Dầu Đậu Nành 1L` |
| **Weight** | Trọng lượng mỗi đơn vị | `0.92` |
| **Unit** | Đơn vị trọng lượng (kg / ton / lb) | `kg` |
| **Packaging** | Loại bao bì | `Bottle` |
| **Price/Unit** | Giá bán mỗi đơn vị sản phẩm | `35000` |

**Các thao tác:**

- **Thêm sản phẩm:** Click nút **`+ Add Product`** để thêm dòng mới
- **Xoá sản phẩm:** Click nút **`✕`** ở cuối mỗi dòng
- Mặc định có sẵn 1 dòng trống

**Loại bao bì hỗ trợ:**

| Bao bì | Mô tả |
|--------|-------|
| 🍶 Bottle | Chai nhựa/thuỷ tinh |
| 🥫 Can / Jerry Can | Lon, can |
| 🪣 Drum (200L) | Thùng phi 200L |
| 💧 Flexitank / ISO Tank | Tank mềm vận chuyển bulk |
| 🛍️ Bag / Sack | Bao, túi |
| 📦 Carton Box | Thùng carton |
| 🏗️ Pallet | Pallet |
| ⚪ Bulk | Hàng rời, không đóng gói |

---

### Bước 4: Mạng Lưới Cung Ứng

Đây là bước quan trọng nhất — mô tả **các địa điểm** (nhà máy, kho, khách hàng) và **các tuyến vận chuyển** kết nối chúng.

#### 4A. Thêm Địa Điểm (Locations)

Click **`+ Add Location`** để mở form thêm địa điểm.

| Trường | Mô tả |
|--------|-------|
| **Name** *(bắt buộc)* | Tên địa điểm |
| **Location Type** | Chọn 1 trong 5 loại (xem bảng dưới) |
| **Address / City** | Địa chỉ hoặc thành phố |

**Loại địa điểm:**

| Loại | Icon | Màu | Mô tả | Trường bổ sung |
|------|------|------|-------|----------------|
| 🏭 **Factory** | Xanh dương | `#2563EB` | Nhà máy sản xuất | Không |
| 🏢 **Warehouse** | Tím | `#8B5CF6` | Kho / Trung tâm phân phối | Storage Area, Monthly Rent, Avg. Dwell Days |
| 📦 **Distribution Hub** | Cam | `#F59E0B` | Trung tâm trung chuyển | Tương tự Warehouse |
| ⚓ **Port / Terminal** | Xanh ngọc | `#06B6D4` | Cảng biển/sông | Không |
| 🏪 **Customer** | Xanh lá | `#059669` | Điểm giao hàng / Khách hàng | Không |

> 💡 **Mẹo:** Khi chọn loại **Warehouse**, form sẽ hiện thêm các trường **Storage Area**, **Monthly Rent**, và **Avg. Dwell Days** để nhập thông tin chi tiết hơn.

#### 4B. Thêm Tuyến Vận Chuyển (Routes)

Click **`+ Add Route`** để thêm tuyến. Mỗi tuyến kết nối 2 địa điểm đã tạo ở trên.

| Trường | Mô tả | Ví dụ |
|--------|-------|-------|
| **From** | Điểm xuất phát (dropdown) | `Nhà Máy Bình Dương` |
| **To** | Điểm đến (dropdown) | `Kho Sài Gòn` |
| **Distance** | Khoảng cách | `35 km` |
| **Transport Mode** | Phương tiện vận chuyển | `Light Truck (<5 ton)` |
| **Carrier Type** | Tự vận chuyển hay thuê | `In-house Fleet` / `3PL` / `Mixed` |
| **Trips/Month** | Số chuyến mỗi tháng | `20` |
| **Cost/Trip** | Chi phí mỗi chuyến | `1,500,000` |
| **Volume/Trip** | Khối lượng mỗi chuyến (tấn) | `15` |

**Phương tiện vận chuyển hỗ trợ:**

| Phương tiện | Mô tả |
|-------------|-------|
| 🚐 Light Truck (<5 ton) | Xe tải nhẹ |
| 🚛 Medium Truck (5–15 ton) | Xe tải trung |
| 🚚 Heavy Truck / Semi (>15 ton) | Xe đầu kéo |
| 🛢️ Tanker Truck | Xe bồn |
| 🚂 Rail / Train | Đường sắt |
| 🚢 Ocean Vessel | Tàu biển |
| ✈️ Air Freight | Đường hàng không |
| 🔁 Multimodal | Đa phương thức |

> ⚠️ **Lưu ý:** Phải thêm ít nhất 2 địa điểm trước khi tạo route (dropdown From/To cần có dữ liệu). Hệ thống sẽ ngăn bạn tạo route vòng (From = To).

---

### Bước 5: Cấu Trúc Chi Phí

Cấu hình chi phí logistics hàng tháng, chia thành **5 nhóm**:

#### Nhóm 1: 🚗 Transportation (Vận chuyển)

| Hạng mục | Mặc định | Mô tả |
|----------|----------|-------|
| Fuel (diesel, gas) | ✅ Bật | Chi phí nhiên liệu |
| Driver & crew wages | ✅ Bật | Lương tài xế, phụ xe |
| Tolls & road fees | ✅ Bật | Phí cầu đường |
| Vehicle depreciation / lease | ✅ Bật | Khấu hao / thuê xe |
| Vehicle insurance & maintenance | ✅ Bật | Bảo hiểm, bảo dưỡng |
| 3PL carrier fees | ❌ Tắt | Phí thuê đơn vị vận chuyển bên ngoài |

#### Nhóm 2: 🏢 Warehousing (Kho bãi)

| Hạng mục | Mặc định | Mô tả |
|----------|----------|-------|
| Warehouse rent / depreciation | ✅ Bật | Tiền thuê / khấu hao kho |
| Utilities (electricity, water) | ✅ Bật | Điện, nước |
| Warehouse staff wages | ✅ Bật | Lương nhân viên kho |
| Equipment (forklift, racks) | ❌ Tắt | Xe nâng, kệ hàng |

#### Nhóm 3: 📦 Handling (Xếp dỡ)

| Hạng mục | Mặc định |
|----------|----------|
| Loading & unloading | ✅ Bật |
| Palletizing & wrapping | ❌ Tắt |
| Labeling & quality check | ❌ Tắt |

#### Nhóm 4: 📉 Loss & Damage (Hao hụt)

| Hạng mục | Mặc định |
|----------|----------|
| Transit damage & claims | ✅ Bật |
| Returns & reverse logistics | ❌ Tắt |
| Expired goods disposal | ❌ Tắt |
| Cargo insurance | ✅ Bật |

#### Nhóm 5: 📋 Administration (Quản lý)

| Hạng mục | Mặc định |
|----------|----------|
| Logistics management staff | ✅ Bật |
| TMS / logistics software | ❌ Tắt |
| Customs & documentation | ❌ Tắt |

**Cách sử dụng:**

1. **Toggle On/Off:** Click công tắc (🔵 = bật, ⚪ = tắt) để bật/tắt hạng mục
2. **Nhập số tiền:** Click vào ô số bên phải, nhập chi phí hàng tháng
3. **Mở rộng nhóm:** Click vào tên nhóm (▶/▼) để mở rộng/thu gọn
4. **Thêm hạng mục:** Click **`+ Add custom category`** ở cuối mỗi nhóm
5. **Monthly Total:** Badge phía trên hiển thị tổng chi phí hàng tháng, cập nhật realtime

> 💡 **Benchmark:** Ngành logistics trung bình chiếm **8–18% doanh thu**, với mức trung bình **12%**. Dashboard sẽ so sánh tỷ lệ của bạn với benchmark này.

---

### Bước 6: Tuỳ Chỉnh Dashboard

Cấu hình giao diện dashboard.

| Trường | Mô tả | Ví dụ |
|--------|-------|-------|
| **Dashboard Title** *(bắt buộc)* | Tiêu đề hiển thị trên dashboard | `Chi Phí Logistics - Tường An` |
| **Currency** | Đơn vị tiền tệ | `₫ VND — Vietnamese Dong` |
| **Weight Unit** | Đơn vị cân nặng (Metric Ton / Kilogram / Pound) | `Metric Ton` |
| **Distance Unit** | Đơn vị khoảng cách (Kilometer / Mile) | `Kilometer (km)` |
| **Company Logo** *(tuỳ chọn)* | Upload logo công ty (PNG, JPEG, SVG, WebP — tối đa 500KB) | — |

**Đơn vị tiền tệ hỗ trợ:** USD, EUR, GBP, VND, JPY, CNY, IDR, MYR, SGD, AUD.

---

## 4. Xem Lại & Khởi Động Dashboard

Sau 6 bước, trang **Review & Launch** hiển thị tóm tắt toàn bộ dữ liệu:

- **🏢 Company** — Tên, ngành, quốc gia, doanh thu
- **📦 Products** — Số sản phẩm đã cấu hình
- **🔗 Supply Chain** — Số địa điểm (Factory/Warehouse/Customer) và số tuyến
- **💰 Cost Structure** — Tổng chi phí hàng tháng, năm, và top 3 hạng mục lớn nhất
- **⚙️ Preferences** — Tiêu đề, tiền tệ, đơn vị

Mỗi phần có nút **Edit** để quay lại bước tương ứng chỉnh sửa.

Khi mọi thứ đã ổn, click:

### 🚀 Launch Dashboard

> 📌 *All data is saved locally in your browser — no server required.*

---

## 5. Dashboard — Bảng Điều Khiển

Dashboard hiển thị 4 phần chính:

### 5A. Header (Thanh trên cùng)

| Thành phần | Mô tả |
|-----------|-------|
| **Logo + Title** | Logo công ty (nếu có) và tiêu đề dashboard |
| **Company Info** | Tên công ty · Ngành nghề |
| **📥 Import** | Nhập cấu hình từ file JSON |
| **📤 Export** | Xuất cấu hình ra file JSON |
| **⚙️ Settings** | Quay lại Wizard để chỉnh sửa |
| **🗑️ Reset** | Xoá toàn bộ dữ liệu, quay về Wizard |

### 5B. KPI Cards (4 thẻ chỉ số)

| KPI | Mô tả | Cách tính |
|-----|-------|-----------|
| **💰 Total Monthly Cost** | Tổng chi phí logistics hàng tháng | Tổng tất cả cost categories đã bật |
| **🚚 Cost Per Ton** | Chi phí vận chuyển trung bình mỗi tấn hàng | Tổng chi phí / tổng volume theo routes |
| **📈 % of Annual Revenue** | Tỷ lệ chi phí logistics trên doanh thu | (Monthly × 12) / Annual Revenue × 100 |
| **🚗 Active Routes** | Số tuyến vận chuyển đang hoạt động | Đếm số routes đã cấu hình |

Mỗi KPI card có **trend indicator** hiển thị xu hướng so với tháng trước (▲ tăng / ▼ giảm).

### 5C. Biểu Đồ

#### 🍩 Cost Breakdown (Phân bổ chi phí)
- **Loại:** Donut chart
- **Hiển thị:** Tỷ lệ phần trăm mỗi nhóm chi phí (Transportation, Warehousing, Handling, Loss, Admin)
- **Trung tâm:** Tổng chi phí hàng tháng (Monthly Total)

#### 📈 Monthly Cost Trend (Xu hướng chi phí 12 tháng)
- **Loại:** Line chart
- **Hiển thị:** Dự báo chi phí 12 tháng (Jan – Dec) dựa trên dữ liệu hiện tại
- **Thống kê bổ sung:**
  - **12-mo average:** Chi phí trung bình 12 tháng
  - **Best month:** Tháng có chi phí thấp nhất (▼ xanh)
  - **Peak month:** Tháng có chi phí cao nhất (▲ đỏ)

#### 🚚 Route Cost Comparison (So sánh chi phí tuyến)
- **Loại:** Horizontal bar chart
- **Hiển thị:** Chi phí hàng tháng mỗi tuyến, sắp xếp từ cao xuống thấp
- **Nhãn:** `Điểm xuất phát → Điểm đến`
- **Tooltip:** Hiện chi tiết: Monthly cost, Per km, Per ton

#### 🔗 Supply Chain Graph (Mạng lưới cung ứng)

Đồ thị SVG tương tác hiển thị toàn bộ mạng lưới logistics — **không cần toạ độ GPS hay Leaflet**.

| Thành phần | Mô tả |
|-----------|-------|
| **Nodes (Circles)** | Mỗi địa điểm (Factory/Warehouse/Customer) hiện dạng hình tròn + emoji + tên |
| **Edges (Curves)** | Đường cong bezier nối 2 nodes, có mũi tên chỉ hướng |
| **Layout tự động** | Factory bên trái → Warehouse giữa → Customer bên phải (hierarchical) |
| **Hover highlight** | Di chuột lên node → edges liên quan sáng, phần còn lại mờ đi |
| **Legend** | Phân biệt: 🔵 Factory · 🟣 Warehouse · 🟢 Customer · — In-house · --- 3PL |

> 💡 **Mẹo:** Độ dày mỗi edge tỷ lệ với chi phí tuyến — tuyến tốn kém hơn có đường dày hơn.

#### 📈 Scenario Analysis (Phân tích kịch bản)

Widget mô phỏng "what-if" cho phép điều chỉnh từng nhóm chi phí và xem tác động real-time.

**Cách sử dụng:**

1. **Kéo slider:** Mỗi nhóm chi phí có 1 slider (-50% → +100%)
2. **Xem kết quả:** Current Monthly vs Projected Monthly cập nhật ngay lập tức
3. **Delta badge:** Hiện chênh lệch (₫ và %) giữa hiện tại và dự kiến
4. **Annual impact:** Tác động tính theo năm (delta × 12)
5. **Bar chart:** So sánh trực quan Baseline vs Projected

**Quản lý kịch bản:**

| Thao tác | Mô tả |
|----------|-------|
| **💾 Save Scenario** | Lưu kịch bản hiện tại (nhập tên) — dữ liệu lưu vào localStorage |
| **📂 Load** | Chọn kịch bản đã lưu từ dropdown — sliders nhảy về giá trị đã lưu |
| **✕ Delete** | Xoá kịch bản khỏi danh sách |
| **↺ Reset all sliders** | Đưa tất cả sliders về 0% |

> 💡 **Ví dụ:** Kéo Transportation +30% → xem ngay chi phí hàng tháng tăng bao nhiêu, và tác động lên cả năm.

---

## 6. Xuất / Nhập Dữ Liệu

### 📤 Export (Xuất dữ liệu)

1. Trên Dashboard, click nút **📤 Export**
2. File JSON sẽ được tải về với tên: `logistics-dashboard-[tên-công-ty]-[ngày].json`
3. File chứa toàn bộ cấu hình (công ty, sản phẩm, supply chain, chi phí, preferences)

**Sử dụng để:**
- Sao lưu dữ liệu
- Chia sẻ cấu hình cho đồng nghiệp
- Chuyển dữ liệu sang trình duyệt/máy khác

### 📥 Import (Nhập dữ liệu)

1. Click nút **📥 Import** trên Dashboard
2. Chọn file JSON đã xuất trước đó
3. Dashboard sẽ tự động cập nhật với dữ liệu mới

> ⚠️ **Giới hạn:** File import tối đa **5MB**. File phải đúng format JSON do ứng dụng này tạo ra.

### 🗑️ Reset (Xoá dữ liệu)

1. Click nút **🗑️** (biểu tượng thùng rác, góc phải Dashboard)
2. Một hộp thoại xác nhận sẽ hiện lên: *"Reset all data? This cannot be undone."*
3. Click **OK** để xoá toàn bộ, ứng dụng sẽ quay về Wizard

> ⚠️ **Cảnh báo:** Thao tác này **không thể hoàn tác**. Hãy Export dữ liệu trước khi Reset.

---

## 7. Câu Hỏi Thường Gặp (FAQ)

### ❓ Dữ liệu của tôi được lưu ở đâu?

Toàn bộ dữ liệu được lưu trong **localStorage** của trình duyệt. Không có dữ liệu nào được gửi lên server. Điều này có nghĩa:
- ✅ An toàn, riêng tư
- ✅ Hoạt động offline
- ⚠️ Xoá cache trình duyệt sẽ mất dữ liệu → hãy **Export** thường xuyên

### ❓ Tôi muốn chỉnh sửa dữ liệu sau khi đã launch?

Click nút **⚙️ Settings** trên Dashboard. Wizard sẽ mở lại với dữ liệu hiện tại, cho phép chỉnh sửa bất kỳ bước nào.

### ❓ Biểu đồ Monthly Cost Trend tính toán như thế nào?

Ứng dụng sử dụng **thuật toán seed-based pseudo-random** dựa trên dữ liệu chi phí hiện tại để tạo biến động thực tế theo mùa (seasonal variation) cho 12 tháng. Mỗi lần load với cùng dữ liệu sẽ cho kết quả **nhất quán** (deterministic).

### ❓ % of Annual Revenue hiển thị đỏ là sao?

KPI card này sẽ hiển thị **thanh cảnh báo đỏ** khi tỷ lệ chi phí logistics vượt quá **benchmark ngành (12%)**. Đây là tín hiệu để bạn xem xét tối ưu hoá chi phí.

### ❓ Tôi có thể sử dụng cho ngành khác ngoài dầu ăn không?

**Có.** Ứng dụng hỗ trợ 8 ngành: Cooking Oil, FMCG, Food & Beverage, Chemical, Pharmaceutical, Agriculture, Retail, và Other. Bạn cũng có thể thêm custom cost categories phù hợp với ngành của mình.

### ❓ Tại sao Cost Per Ton hiển thị "—"?

KPI này cần dữ liệu **Volume per Trip** trong routes. Nếu bạn chưa nhập volume cho bất kỳ route nào, giá trị sẽ hiển thị "—".

### ❓ Tôi có thể chạy trên mobile không?

Dashboard có layout responsive và hoạt động trên tablet/mobile, tuy nhiên trải nghiệm tốt nhất là trên **desktop** (≥1024px) vì biểu đồ sẽ hiển thị rõ ràng hơn.

---

## Phụ Lục: Keyboard Shortcuts

| Phím | Chức năng | Ngữ cảnh |
|------|-----------|----------|
| `Enter` | Chuyển bước tiếp theo (= click "Next →") | Wizard (Steps 1-5) |
| `Escape` | Huỷ chỉnh sửa, quay về Dashboard (= click "✕ Cancel") | Wizard Edit Mode (Step 1) |
| `Tab` | Di chuyển focus giữa các trường | Toàn bộ ứng dụng |

---

## Phụ Lục: Cấu Trúc File JSON Export

```json
{
  "company": {
    "name": "Tên công ty",
    "industry": "cooking-oil",
    "country": "VN",
    "scale": "medium",
    "annualRevenue": 120000000000,
    "employeeCount": 850,
    "channels": ["wholesale", "retail-chain", "ecommerce"],
    "coverageArea": "national"
  },
  "products": [
    {
      "id": "p1",
      "name": "Dầu Đậu Nành 1L",
      "weight": 0.92,
      "unit": "kg",
      "packType": "bottle",
      "pricePerUnit": 35000
    }
  ],
  "nodes": [
    {
      "id": "n1",
      "name": "Nhà Máy Bình Dương",
      "type": "factory",
      "address": "Thuận An, Bình Dương"
    }
  ],
  "routes": [
    {
      "id": "r1",
      "fromId": "n1",
      "toId": "n2",
      "distance": 35,
      "distanceUnit": "km",
      "transportMode": "truck-light",
      "carrier": "in-house",
      "frequency": 20,
      "frequencyUnit": "per-month",
      "costPerTrip": 1500000,
      "volumePerTrip": 15,
      "volumeUnit": "ton"
    }
  ],
  "costCategories": [
    {
      "id": "c01",
      "group": "transportation",
      "name": "Fuel (diesel, gas)",
      "enabled": true,
      "monthlyCost": 45000000
    }
  ],
  "preferences": {
    "currency": "VND",
    "currencySymbol": "₫",
    "weightUnit": "ton",
    "distanceUnit": "km",
    "dashboardTitle": "Chi Phí Logistics - Tường An",
    "logo": null
  }
}
```

---

> 📧 **Liên hệ hỗ trợ:** Nếu gặp vấn đề, vui lòng liên hệ team phát triển.  
> 📝 **License:** MIT
