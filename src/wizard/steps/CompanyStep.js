import { INDUSTRY_OPTIONS, COUNTRY_OPTIONS, DISTRIBUTION_CHANNELS } from '../../data/defaults.js'
import { formatNumberInput, getRawNumber, escapeHtml as esc } from '../../core/utils.js'
import { showValidationBanner, clearValidationBanner, markFieldError, clearFieldErrors } from '../components/FormHelpers.js'

export const CompanyStep = {
  render(container, data, onUpdate) {
    const d = data || {}
    const channels = d.channels || []

    container.innerHTML = `
      <div class="step-heading">
        <h2>🏢 About the Company</h2>
        <p>Tell us about the business whose logistics costs we're analyzing.</p>
      </div>

      <div id="company-validation"></div>

      <div class="form-grid-2">
        <div class="form-group" id="fg-name" style="grid-column:1/-1">
          <label class="form-label" for="company-name">Company Name <span style="color:var(--color-danger)">*</span></label>
          <input type="text" id="company-name" placeholder="e.g. GoldenHarvest Foods" value="${esc(d.name || '')}">
          <span class="form-error">Company name is required (min. 2 characters)</span>
        </div>

        <div class="form-group" id="fg-industry">
          <label class="form-label" for="company-industry">Industry</label>
          <select id="company-industry">
            ${INDUSTRY_OPTIONS.map(o => `<option value="${o.value}" ${d.industry === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
          </select>
        </div>

        <div class="form-group" id="fg-country">
          <label class="form-label" for="company-country">Primary Country</label>
          <select id="company-country">
            ${COUNTRY_OPTIONS.map(o => `<option value="${o.value}" ${d.country === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Company Scale</label>
        <div class="radio-cards" id="scale-cards">
          ${['small','medium','large','enterprise'].map(s => `
            <label class="radio-card ${d.scale === s ? 'selected' : ''}">
              <input type="radio" name="company-scale" value="${s}" ${d.scale === s ? 'checked' : ''}>
              ${{small:'🏪 Small',medium:'🏭 Medium',large:'🏗️ Large',enterprise:'🌐 Enterprise'}[s]}
            </label>
          `).join('')}
        </div>
      </div>

      <div class="form-grid-2">
        <div class="form-group" id="fg-revenue">
          <label class="form-label" for="company-revenue">Annual Revenue (optional)</label>
          <input type="text" inputmode="numeric" id="company-revenue" placeholder="e.g. 500,000,000" data-raw-value="${d.annualRevenue || ''}" value="${d.annualRevenue ? Number(d.annualRevenue).toLocaleString('en-US') : ''}">
          <span class="form-hint">Used to calculate logistics cost as % of revenue</span>
          <span class="form-error">Revenue must be a positive number</span>
        </div>
        <div class="form-group" id="fg-employees">
          <label class="form-label" for="company-employees">Number of Employees (optional)</label>
          <input type="text" inputmode="numeric" id="company-employees" placeholder="e.g. 1,200" data-raw-value="${d.employeeCount || ''}" value="${d.employeeCount ? Number(d.employeeCount).toLocaleString('en-US') : ''}">
          <span class="form-error">Employee count must be a positive number</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Distribution Channels</label>
        <div class="checkbox-group">
          ${DISTRIBUTION_CHANNELS.map(ch => `
            <label class="checkbox-option ${channels.includes(ch.value) ? 'checked' : ''}">
              <input type="checkbox" name="channel" value="${ch.value}" ${channels.includes(ch.value) ? 'checked' : ''}>
              ${ch.label}
            </label>
          `).join('')}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Distribution Coverage</label>
        <div class="radio-cards" id="coverage-cards">
          ${['local','regional','national','international','global'].map(s => `
            <label class="radio-card ${d.coverageArea === s ? 'selected' : ''}">
              <input type="radio" name="coverage" value="${s}" ${d.coverageArea === s ? 'checked' : ''}>
              ${{local:'📍 Local',regional:'🗺️ Regional',national:'🌐 National',international:'✈️ International',global:'🌍 Global'}[s]}
            </label>
          `).join('')}
        </div>
      </div>
    `

    const collect = () => {
      const checkedChannels = [...container.querySelectorAll('input[name="channel"]:checked')].map(el => el.value)
      return {
        name: container.querySelector('#company-name').value.trim(),
        industry: container.querySelector('#company-industry').value,
        country: container.querySelector('#company-country').value,
        scale: container.querySelector('input[name="company-scale"]:checked')?.value || 'medium',
        annualRevenue: getRawNumber(container.querySelector('#company-revenue')),
        employeeCount: Math.round(getRawNumber(container.querySelector('#company-employees'))),
        channels: checkedChannels,
        coverageArea: container.querySelector('input[name="coverage"]:checked')?.value || 'national',
      }
    }

    // Live update on any change
    container.querySelectorAll('input, select').forEach(el => {
      if (el.dataset.rawValue !== undefined) return // handled by formatNumberInput
      el.addEventListener('input', () => { clearValidationBanner('company-validation'); onUpdate(collect()) })
      el.addEventListener('change', () => { clearValidationBanner('company-validation'); onUpdate(collect()) })
    })

    // Radio card visual selection
    container.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const group = radio.name
        container.querySelectorAll(`input[name="${group}"]`).forEach(r => {
          r.closest('.radio-card')?.classList.toggle('selected', r.checked)
        })
      })
    })

    // Checkbox option visual selection
    container.querySelectorAll('input[name="channel"]').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('.checkbox-option')?.classList.toggle('checked', cb.checked)
      })
    })

    // Auto-format number inputs with thousands separators
    formatNumberInput(container.querySelector('#company-revenue'))
    formatNumberInput(container.querySelector('#company-employees'))
  },

  validate(data) {
    const errors = []
    if (!data?.name || data.name.length < 2) errors.push('Company name is required (min. 2 characters)')
    if (data?.annualRevenue && data.annualRevenue < 0) errors.push('Revenue must be a positive number')
    if (data?.employeeCount && data.employeeCount < 0) errors.push('Employee count must be a positive number')
    return { valid: errors.length === 0, errors }
  }
}

