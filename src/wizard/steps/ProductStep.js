import { PACK_TYPES } from '../../data/defaults.js'
import { generateId, formatNumberInput, getRawNumber, escapeHtml as esc } from '../../core/utils.js'

export const ProductStep = {
  render(container, data, onUpdate) {
    const products = (data && data.length) ? data : [{
      id: generateId('p'), name: '', weight: '', unit: 'kg', packType: 'bottle', pricePerUnit: ''
    }]

    container.innerHTML = `
      <div class="step-heading">
        <h2>📦 Products</h2>
        <p>List the products you distribute. This helps calculate cost per unit and volume metrics.</p>
      </div>
      <div id="product-validation"></div>
      <div class="product-table-wrap">
        <table class="product-table">
          <thead>
            <tr>
              <th style="width:38%">Product Name</th>
              <th style="width:13%">Weight</th>
              <th style="width:10%">Unit</th>
              <th style="width:16%">Packaging</th>
              <th style="width:14%">Price/Unit</th>
              <th style="width:9%"></th>
            </tr>
          </thead>
          <tbody id="product-tbody">
          </tbody>
        </table>
      </div>
      <div style="margin-top:var(--space-3);display:flex;justify-content:flex-end">
        <button class="btn btn-secondary btn-sm" id="add-product-btn">+ Add Product</button>
      </div>
    `

    let rows = [...products]

    const renderRows = () => {
      const tbody = container.querySelector('#product-tbody')
      tbody.innerHTML = ''
      rows.forEach((row, i) => {
        const tr = document.createElement('tr')
        tr.className = 'product-row'
        tr.innerHTML = `
          <td><input type="text" placeholder="e.g. Soybean Oil 1L Bottle" value="${esc(row.name || '')}" data-field="name"></td>
          <td><input type="number" placeholder="0.92" min="0" step="any" value="${row.weight || ''}" data-field="weight" style="text-align:right"></td>
          <td>
            <select data-field="unit" style="width:100%">
              <option value="kg" ${row.unit === 'kg' ? 'selected' : ''}>kg</option>
              <option value="g"  ${row.unit === 'g'  ? 'selected' : ''}>g</option>
              <option value="lb" ${row.unit === 'lb' ? 'selected' : ''}>lb</option>
              <option value="ton"${row.unit === 'ton'? 'selected' : ''}>ton</option>
            </select>
          </td>
          <td>
            <select data-field="packType" style="width:100%">
              ${PACK_TYPES.map(p => `<option value="${p.value}" ${row.packType === p.value ? 'selected':''}>${p.label}</option>`).join('')}
            </select>
          </td>
          <td><input type="text" inputmode="numeric" placeholder="0" data-field="pricePerUnit" data-raw-value="${row.pricePerUnit || ''}" value="${row.pricePerUnit ? Number(row.pricePerUnit).toLocaleString('en-US') : ''}" style="text-align:right"></td>
          <td style="text-align:center">
            <button class="btn btn-ghost btn-icon btn-sm product-remove" data-index="${i}" ${rows.length === 1 ? 'disabled' : ''}
                    title="Remove product" aria-label="Remove product ${i+1}">✕</button>
          </td>
        `

        // Field change listeners
        tr.querySelectorAll('[data-field]').forEach(el => {
          el.addEventListener('input', () => {
            if (el.dataset.rawValue !== undefined) return // handled by formatNumberInput
            rows[i][el.dataset.field] = el.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value
            onUpdate(rows)
          })
          el.addEventListener('change', () => {
            if (el.dataset.rawValue !== undefined) return
            rows[i][el.dataset.field] = el.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value
            onUpdate(rows)
          })
        })

        tbody.appendChild(tr)

        // Attach price formatter
        const priceInput = tr.querySelector('[data-field="pricePerUnit"]')
        if (priceInput) {
          formatNumberInput(priceInput, {
            onInput: (val) => { rows[i].pricePerUnit = val; onUpdate(rows) }
          })
        }
      })

      // Remove buttons
      tbody.querySelectorAll('.product-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index)
          if (rows.length > 1) {
            rows.splice(idx, 1)
            renderRows()
            onUpdate(rows)
          }
        })
      })
    }

    renderRows()

    container.querySelector('#add-product-btn').addEventListener('click', () => {
      rows.push({ id: generateId('p'), name: '', weight: '', unit: 'kg', packType: 'bottle', pricePerUnit: '' })
      renderRows()
      onUpdate(rows)
      // Focus new row name input
      const inputs = container.querySelectorAll('.product-row input[data-field="name"]')
      inputs[inputs.length - 1]?.focus()
    })
  },

  validate(data) {
    const errors = []
    if (!data || data.length === 0) {
      errors.push('Add at least one product')
      return { valid: false, errors }
    }
    data.forEach((p, i) => {
      if (!p.name?.trim()) errors.push(`Product ${i + 1}: name is required`)
      if (p.weight !== '' && p.weight !== undefined && Number(p.weight) <= 0) {
        errors.push(`Product ${i + 1}: weight must be positive`)
      }
    })
    return { valid: errors.length === 0, errors }
  }
}

