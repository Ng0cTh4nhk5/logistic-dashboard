import { COST_GROUP_META, DEFAULT_COST_CATEGORIES } from '../../data/defaults.js'
import { sanitizeNumber, formatCurrency, formatNumberInput, getRawNumber, deepClone, generateId, escapeHtml as esc } from '../../core/utils.js'

export const CostStep = {
  render(container, data, onUpdate, symbol = '$') {
    let categories = (data && data.length) ? deepClone(data) : deepClone(DEFAULT_COST_CATEGORIES)

    const renderAll = () => {
      const total = categories
        .filter(c => c.enabled)
        .reduce((sum, c) => sum + (Number(c.monthlyCost) || 0), 0)

      container.innerHTML = `
        <div class="step-heading">
          <h2>💰 Cost Structure</h2>
          <p>Configure your monthly logistics costs across each category. Enable only the ones relevant to your business.</p>
        </div>
        <div id="cost-validation"></div>

        <div class="cost-header">
          <span style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">
            Toggle costs on/off and enter monthly amounts
          </span>
          <div class="cost-total-badge" id="cost-total-badge">
            📊 Monthly Total: ${formatCurrency(total, symbol)}
          </div>
        </div>

        ${Object.entries(COST_GROUP_META).map(([groupKey, meta], gi) => {
          const groupCats = categories.filter(c => c.group === groupKey)
          const enabledCount = groupCats.filter(c => c.enabled).length
          const isOpen = gi < 2 // Transportation + Warehousing open by default
          return `
            <div class="cost-group ${isOpen ? '' : 'cost-group--collapsed'}" data-group="${groupKey}">
              <button class="cost-group-header"
                      aria-expanded="${isOpen}"
                      aria-controls="cost-group-body-${groupKey}"
                      type="button">
                <div class="cost-group-header-left">
                  <span style="font-size:1.1rem">${meta.label.split(' ')[0]}</span>
                  <span>${meta.label.split(' ').slice(1).join(' ')}</span>
                  <span class="cost-group-count">${enabledCount} active</span>
                </div>
                <span class="cost-group-chevron">▼</span>
              </button>
              <div class="cost-group-body" id="cost-group-body-${groupKey}" role="region">
                ${groupCats.map(cat => costRowHTML(cat)).join('')}
                <div style="padding:var(--space-3) var(--space-4);border-top:1px solid var(--color-border)">
                  <button class="btn btn-ghost btn-sm add-category-btn" data-group="${groupKey}" type="button">
                    + Add custom category
                  </button>
                </div>
              </div>
            </div>
          `
        }).join('')}
      `

      bindEvents()
    }

    // Custom items: id from generateId('c') = 'c_xxxxx', defaults: 'c01'-'c30'
    const isCustom = (id) => !/^c\d+$/.test(id)

    const costRowHTML = (cat) => `
      <div class="cost-row ${cat.enabled ? '' : 'cost-row--disabled'}" data-cat-id="${cat.id}">
        <label class="toggle-switch" aria-label="Enable ${cat.name}">
          <input type="checkbox" role="switch" ${cat.enabled ? 'checked' : ''}
                 aria-checked="${cat.enabled}" aria-label="Enable ${cat.name}">
          <span class="slider"></span>
        </label>
        ${isCustom(cat.id)
          ? `<input type="text" class="cost-row-name-input" value="${esc(cat.name)}" placeholder="Category name" aria-label="Category name">`
          : `<span class="cost-row-name">${esc(cat.name)}</span>`
        }
        <div class="cost-row-input">
          <span class="cost-row-symbol">${symbol}</span>
          <input type="text" inputmode="numeric"
                 data-raw-value="${cat.monthlyCost || 0}"
                 value="${cat.monthlyCost > 0 ? Number(cat.monthlyCost).toLocaleString('en-US') : '0'}"
                 placeholder="0"
                 ${cat.enabled ? '' : 'disabled'}
                 aria-label="${esc(cat.name)} monthly cost">
        </div>
        ${isCustom(cat.id)
          ? `<button class="btn btn-ghost btn-icon btn-sm cost-delete-btn"
                     data-cat-id="${cat.id}" title="Remove custom category"
                     aria-label="Remove ${esc(cat.name)}" style="color:var(--color-danger);flex-shrink:0">✕</button>`
          : ''
        }
      </div>
    `

    const bindEvents = () => {
      // Toggle switches
      container.querySelectorAll('.cost-row .toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', () => {
          const row = toggle.closest('.cost-row')
          const catId = row.dataset.catId
          const cat = categories.find(c => c.id === catId)
          if (!cat) return

          cat.enabled = toggle.checked
          row.classList.toggle('cost-row--disabled', !toggle.checked)
          row.querySelector('.cost-row-input input').disabled = !toggle.checked

          // Update count badge in header
          const group = cat.group
          const groupCats = categories.filter(c => c.group === group)
          const enabledCount = groupCats.filter(c => c.enabled).length
          container.querySelector(`[data-group="${group}"] .cost-group-count`).textContent = `${enabledCount} active`

          updateTotal()
          onUpdate(categories)
        })
      })

      // Cost inputs — formatted with thousands separator
      container.querySelectorAll('.cost-row .cost-row-input input[type="text"]').forEach(input => {
        formatNumberInput(input, {
          onInput: () => {
            const row = input.closest('.cost-row')
            const catId = row.dataset.catId
            const cat = categories.find(c => c.id === catId)
            if (!cat) return
            cat.monthlyCost = getRawNumber(input)
            updateTotal()
            onUpdate(categories)
          }
        })
      })

      // Custom category name editing
      container.querySelectorAll('.cost-row-name-input').forEach(nameInput => {
        nameInput.addEventListener('input', () => {
          const row = nameInput.closest('.cost-row')
          const catId = row.dataset.catId
          const cat = categories.find(c => c.id === catId)
          if (cat) {
            cat.name = nameInput.value.trim() || 'Unnamed'
            onUpdate(categories)
          }
        })
      })

      // Delete custom category
      container.querySelectorAll('.cost-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const catId = btn.dataset.catId
          const cat = categories.find(c => c.id === catId)
          if (!cat) return
          if (!confirm(`Remove custom category "${cat.name}"?`)) return
          categories = categories.filter(c => c.id !== catId)
          renderAll()
          onUpdate(categories)
        })
      })

      // Collapsible group headers
      container.querySelectorAll('.cost-group-header').forEach(btn => {
        btn.addEventListener('click', () => {
          const group = btn.closest('.cost-group')
          const isCollapsed = group.classList.toggle('cost-group--collapsed')
          btn.setAttribute('aria-expanded', !isCollapsed)
        })
      })

      // Add custom category
      container.querySelectorAll('.add-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const groupKey = btn.dataset.group
          const newCat = {
            id: generateId('c'),
            group: groupKey,
            name: 'Custom cost item',
            enabled: true,
            monthlyCost: 0,
          }
          categories.push(newCat)
          renderAll()
          onUpdate(categories)
        })
      })
    }

    const updateTotal = () => {
      const total = categories
        .filter(c => c.enabled)
        .reduce((sum, c) => sum + (Number(c.monthlyCost) || 0), 0)
      const badge = container.querySelector('#cost-total-badge')
      if (badge) badge.textContent = `📊 Monthly Total: ${formatCurrency(total, symbol)}`
    }

    renderAll()
    // onUpdate removed: only call onUpdate on user interaction, not on render
  },

  validate(data) {
    const errors = []
    if (!data || !data.some(c => c.enabled)) {
      errors.push('Enable at least one cost category')
    }
    return { valid: errors.length === 0, errors }
  }
}

