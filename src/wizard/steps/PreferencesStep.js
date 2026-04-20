import { CURRENCY_OPTIONS, WEIGHT_UNITS, DISTANCE_UNITS } from '../../data/defaults.js'
import { toBase64, resizeImage, showToast, escapeHtml as esc } from '../../core/utils.js'

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2 MB

export const PreferencesStep = {
  render(container, data, onUpdate) {
    const d = data || {}

    container.innerHTML = `
      <div class="step-heading">
        <h2>⚙️ Dashboard Preferences</h2>
        <p>Customize how your dashboard looks and what units it uses.</p>
      </div>

      <div class="form-group" id="fg-title">
        <label class="form-label" for="pref-title">Dashboard Title *</label>
        <input type="text" id="pref-title" placeholder="e.g. Logistics Cost Dashboard"
               value="${esc(d.dashboardTitle || 'Logistics Cost Dashboard')}">
        <span class="form-hint">This will appear in the dashboard header.</span>
        <span class="form-error">Title is required (min. 3 characters)</span>
      </div>

      <div class="form-grid-2">
        <div class="form-group">
          <label class="form-label" for="pref-currency">Currency</label>
          <select id="pref-currency">
            ${CURRENCY_OPTIONS.map(c => `
              <option value="${c.code}" data-symbol="${c.symbol}" ${d.currency === c.code ? 'selected' : ''}>
                ${c.symbol} ${c.code} — ${c.name}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Weight Unit</label>
          <div class="radio-cards">
            ${WEIGHT_UNITS.map(u => `
              <label class="radio-card ${d.weightUnit === u.value ? 'selected' : ''}">
                <input type="radio" name="pref-weight" value="${u.value}" ${d.weightUnit === u.value ? 'checked' : ''}>
                ${u.label}
              </label>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Distance Unit</label>
          <div class="radio-cards">
            ${DISTANCE_UNITS.map(u => `
              <label class="radio-card ${d.distanceUnit === u.value ? 'selected' : ''}">
                <input type="radio" name="pref-distance" value="${u.value}" ${d.distanceUnit === u.value ? 'checked' : ''}>
                ${u.label}
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Company Logo (optional)</label>
        <div style="display:flex;align-items:center;gap:var(--space-4)">
          <div id="logo-preview" style="
            width:64px;height:64px;border-radius:var(--radius-md);
            background:var(--color-surface-alt);border:2px dashed var(--color-border);
            display:flex;align-items:center;justify-content:center;
            font-size:1.5rem;overflow:hidden;flex-shrink:0;
          ">
            ${d.logo ? `<img src="${d.logo}" style="width:100%;height:100%;object-fit:contain">` : '🖼️'}
          </div>
          <div>
            <input type="file" id="pref-logo" accept="image/png,image/jpeg,image/svg+xml,image/webp"
                   style="width:auto" aria-label="Upload company logo">
            <p class="form-hint">PNG, JPEG, SVG or WebP · Max 2MB · Large images are auto-resized</p>
            ${d.logo ? `<button class="btn btn-ghost btn-sm" id="remove-logo" style="margin-top:var(--space-2)">✕ Remove logo</button>` : ''}
          </div>
        </div>
      </div>
    `

    const collect = () => ({
      dashboardTitle: container.querySelector('#pref-title').value.trim(),
      currency: container.querySelector('#pref-currency').value,
      currencySymbol: container.querySelector('#pref-currency').selectedOptions[0]?.dataset.symbol || '$',
      weightUnit: container.querySelector('input[name="pref-weight"]:checked')?.value || 'ton',
      distanceUnit: container.querySelector('input[name="pref-distance"]:checked')?.value || 'km',
      logo: d.logo || null,
    })

    // Text input changes
    container.querySelector('#pref-title').addEventListener('input', () => onUpdate(collect()))
    container.querySelector('#pref-currency').addEventListener('change', () => onUpdate(collect()))

    // Radio cards
    container.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const group = radio.name
        container.querySelectorAll(`input[name="${group}"]`).forEach(r => {
          r.closest('.radio-card')?.classList.toggle('selected', r.checked)
        })
        onUpdate(collect())
      })
    })

    // Logo upload
    container.querySelector('#pref-logo').addEventListener('change', async function() {
      const file = this.files[0]
      if (!file) return

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showToast('Only PNG, JPEG, SVG and WebP images are allowed.', 'error'); return
      }

      try {
        let base64
        if (file.size > MAX_IMAGE_SIZE) {
          base64 = await resizeImage(file, 300, 300)
        } else {
          base64 = await toBase64(file)
        }
        d.logo = base64
        container.querySelector('#logo-preview').innerHTML = `<img src="${base64}" style="width:100%;height:100%;object-fit:contain">`
        onUpdate(collect())
      } catch (err) {
        showToast('Failed to load image.', 'error')
      }
    })

    // Remove logo
    const removeLogo = container.querySelector('#remove-logo')
    if (removeLogo) {
      removeLogo.addEventListener('click', () => {
        d.logo = null
        container.querySelector('#logo-preview').innerHTML = '🖼️'
        removeLogo.remove()
        onUpdate(collect())
      })
    }

    // onUpdate removed: only call onUpdate on user interaction, not on render
  },

  validate(data) {
    const errors = []
    if (!data?.dashboardTitle || data.dashboardTitle.length < 3) {
      errors.push('Dashboard title is required (min. 3 characters)')
    }
    return { valid: errors.length === 0, errors }
  }
}

