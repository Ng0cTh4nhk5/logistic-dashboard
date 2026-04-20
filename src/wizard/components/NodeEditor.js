import { NODE_TYPES } from '../../data/defaults.js'
import { generateId, sanitizeNumber, formatNumberInput, getRawNumber, escapeHtml as esc } from '../../core/utils.js'

const TYPE_ICONS = { factory:'🏭', warehouse:'🏢', dc:'📦', port:'⚓', customer:'🏪' }

/**
 * @param {HTMLElement} container
 * @param {Array} initialNodes
 * @param {Array} initialRoutes - needed to detect dependencies before delete
 * @param {function} onChange({ nodes, routes })
 */
export function renderNodeEditor(container, initialNodes, initialRoutes, onChange, symbol = '$') {
  let nodes = [...(initialNodes || [])]
  let routes = [...(initialRoutes || [])]
  let editingId = null  // null = adding new, id = editing existing
  let formOpen = false

  const render = () => {
    container.innerHTML = ''

    // Group by type
    const groups = { factory: [], warehouse: [], dc: [], port: [], customer: [] }
    nodes.forEach(n => { if (n.type in groups) groups[n.type].push(n) })

    const groupLabels = {
      factory:   '🏭 Factories',
      warehouse: '🏢 Warehouses',
      dc:        '📦 Distribution Hubs',
      port:      '⚓ Ports / Terminals',
      customer:  '🏪 Customer Points',
    }

    Object.entries(groups).forEach(([type, list]) => {
      if (list.length === 0) return
      const section = document.createElement('div')
      section.className = 'node-section'
      section.innerHTML = `
        <div class="node-section-header">
          <span class="node-section-title">${groupLabels[type]} (${list.length})</span>
        </div>
        <div class="node-list">
          ${list.map(n => nodeCardHTML(n)).join('')}
        </div>
      `
      section.querySelectorAll('.node-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openForm(btn.dataset.id))
      })
      section.querySelectorAll('.node-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteNode(btn.dataset.id))
      })
      container.appendChild(section)
    })

    if (nodes.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:var(--space-8);color:var(--color-text-muted);font-size:var(--font-size-sm)">
          No locations added yet. Click "Add Location" below.
        </div>
      `
    }

    // Add button + form area
    const formWrap = document.createElement('div')
    formWrap.id = 'node-form-wrap'
    if (formOpen) {
      formWrap.innerHTML = nodeFormHTML(editingId ? nodes.find(n => n.id === editingId) : null)
      formWrap.querySelector('#node-save-btn').addEventListener('click', saveForm)
      formWrap.querySelector('#node-cancel-btn').addEventListener('click', closeForm)

      // Radio card selection for Location Type
      formWrap.querySelectorAll('input[name="node-type-radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
          // Update visual selected state
          formWrap.querySelectorAll('input[name="node-type-radio"]').forEach(r => {
            r.closest('.radio-card')?.classList.toggle('selected', r.checked)
          })
          // Toggle warehouse-only fields
          const warehouseFields = formWrap.querySelector('#warehouse-fields-section')
          if (warehouseFields) {
            warehouseFields.style.display = (radio.value === 'warehouse' || radio.value === 'dc') ? '' : 'none'
          }
        })
      })
    } else {
      const addBtn = document.createElement('button')
      addBtn.className = 'btn btn-secondary btn-sm'
      addBtn.id = 'add-node-btn'
      addBtn.textContent = '+ Add Location'
      addBtn.addEventListener('click', () => openForm(null))
      formWrap.appendChild(addBtn)
    }
    container.appendChild(formWrap)
  }

  const nodeCardHTML = (n) => {
    const meta = []
    if (n.address) meta.push(esc(n.address))
    if (n.area) meta.push(`${n.area.toLocaleString()} ${n.areaUnit || 'sqft'}`)
    if (n.monthlyRent) meta.push(`${symbol}${Number(n.monthlyRent).toLocaleString()}/mo`)
    return `
      <div class="node-card node-card--${n.type}">
        <span class="node-card-icon">${TYPE_ICONS[n.type] || '📍'}</span>
        <div class="node-card-info">
          <div class="node-card-name">${esc(n.name)}</div>
          ${meta.length ? `<div class="node-card-meta">${meta.join(' · ')}</div>` : ''}
        </div>
        <div class="node-card-actions">
          <button class="btn btn-ghost btn-icon btn-sm node-edit-btn" data-id="${n.id}" title="Edit" aria-label="Edit ${esc(n.name)}">✎</button>
          <button class="btn btn-ghost btn-icon btn-sm node-delete-btn" data-id="${n.id}" title="Delete" aria-label="Delete ${esc(n.name)}" style="color:var(--color-danger)">✕</button>
        </div>
      </div>
    `
  }

  const nodeFormHTML = (existing) => {
    const n = existing || {}
    const currentType = n.type || 'factory'
    const isWh = currentType === 'warehouse' || currentType === 'dc'
    return `
      <div class="node-form">
        <div class="node-form-title">${existing ? 'Edit Location' : 'Add Location'}</div>
        <div class="form-grid-2">
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label" for="node-name">Name *</label>
            <input type="text" id="node-name" placeholder="e.g. Houston Main Factory" value="${esc(n.name || '')}">
          </div>
        </div>

        <div class="form-group" style="margin-bottom:var(--space-4)">
          <label class="form-label">Location Type</label>
          <div class="radio-cards" id="node-type-cards" style="flex-wrap:wrap;gap:var(--space-2)">
            ${NODE_TYPES.map(t => `
              <label class="radio-card ${currentType === t.value ? 'selected' : ''}" style="padding:var(--space-2) var(--space-3);font-size:var(--font-size-xs)">
                <input type="radio" name="node-type-radio" value="${t.value}" ${currentType === t.value ? 'checked' : ''}>
                ${t.label}
              </label>
            `).join('')}
          </div>
        </div>

        <div class="form-group" style="margin-bottom:var(--space-4)">
          <label class="form-label" for="node-address">Address / City</label>
          <input type="text" id="node-address" placeholder="e.g. Houston, TX" value="${esc(n.address || '')}">
        </div>

        <div class="warehouse-fields" id="warehouse-fields-section" style="display:${isWh ? '' : 'none'}">
          <hr class="divider" style="margin:var(--space-3) 0">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="node-area">Storage Area</label>
              <input type="text" inputmode="numeric" id="node-area" placeholder="e.g. 8,000" data-raw-value="${n.area || ''}" value="${n.area ? Number(n.area).toLocaleString('en-US') : ''}">
            </div>
            <div class="form-group">
              <label class="form-label" for="node-area-unit">Unit</label>
              <select id="node-area-unit">
                <option value="sqft" ${n.areaUnit === 'sqft' ? 'selected' : ''}>sqft</option>
                <option value="sqm"  ${n.areaUnit === 'sqm'  ? 'selected' : ''}>sqm (m²)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="node-rent">Monthly Rent / Cost (${symbol})</label>
              <input type="text" inputmode="numeric" id="node-rent" placeholder="e.g. 18,000" data-raw-value="${n.monthlyRent || ''}" value="${n.monthlyRent ? Number(n.monthlyRent).toLocaleString('en-US') : ''}">
            </div>
            <div class="form-group">
              <label class="form-label" for="node-dwell">Avg. Dwell Days</label>
              <input type="number" id="node-dwell" min="0" placeholder="e.g. 7" value="${n.avgDwellDays || ''}">
            </div>
          </div>
        </div>

        <div class="node-form-actions">
          <button class="btn btn-ghost btn-sm" id="node-cancel-btn">Cancel</button>
          <button class="btn btn-primary btn-sm" id="node-save-btn">
            ${existing ? 'Save Changes' : 'Add Location'}
          </button>
        </div>
      </div>
    `
  }

  const openForm = (id) => {
    editingId = id
    formOpen = true
    render()
    document.getElementById('node-name')?.focus()
    // Attach format to numeric text inputs
    const areaInput = document.getElementById('node-area')
    const rentInput = document.getElementById('node-rent')
    if (areaInput) formatNumberInput(areaInput)
    if (rentInput) formatNumberInput(rentInput)
  }

  const closeForm = () => {
    formOpen = false
    editingId = null
    render()
    document.getElementById('add-node-btn')?.focus()
  }

  const saveForm = () => {
    const wrap = document.querySelector('#node-form-wrap')
    const name = wrap.querySelector('#node-name')?.value.trim()
    if (!name) {
      wrap.querySelector('#node-name').style.borderColor = 'var(--color-danger)'
      wrap.querySelector('#node-name').focus()
      return
    }

    const nodeType = wrap.querySelector('input[name="node-type-radio"]:checked')?.value || 'factory'
    const node = {
      id: editingId || generateId('n'),
      name,
      type: nodeType,
      address: wrap.querySelector('#node-address')?.value.trim() || '',
      lat: null,
      lng: null,
    }

    if (nodeType === 'warehouse' || nodeType === 'dc') {
      node.area = getRawNumber(wrap.querySelector('#node-area'))
      node.areaUnit = wrap.querySelector('#node-area-unit')?.value || 'sqft'
      node.monthlyRent = getRawNumber(wrap.querySelector('#node-rent'))
      node.avgDwellDays = sanitizeNumber(wrap.querySelector('#node-dwell')?.value, { integer: true })
    }

    if (editingId) {
      const idx = nodes.findIndex(n => n.id === editingId)
      if (idx !== -1) nodes[idx] = node
    } else {
      nodes.push(node)
    }

    closeForm()
    onChange({ nodes, routes })
  }

  const deleteNode = (id) => {
    const affected = routes.filter(r => r.fromId === id || r.toId === id)
    const wrap = document.querySelector('#node-form-wrap') || container

    if (affected.length > 0) {
      // Show inline confirmation
      const confirmId = 'delete-confirm-' + id
      let existingConfirm = document.getElementById(confirmId)
      if (existingConfirm) { existingConfirm.remove(); return }

      const nodeCard = container.querySelector(`[data-id="${id}"]`)?.closest('.node-card')
      if (!nodeCard) return

      const confirmEl = document.createElement('div')
      confirmEl.className = 'inline-confirm'
      confirmEl.id = confirmId
      confirmEl.innerHTML = `
        <div class="inline-confirm-header">⚠️ This location is used by ${affected.length} route(s).</div>
        <p style="font-size:var(--font-size-xs);color:var(--color-text-secondary);margin-bottom:var(--space-2)">
          Deleting it will also remove these routes:
        </p>
        <ul class="inline-confirm-list">
          ${affected.map(r => `<li>${r.fromId === id ? '→' : '←'} ${getRouteName(r, nodes)}</li>`).join('')}
        </ul>
        <div class="inline-confirm-actions">
          <button class="btn btn-ghost btn-sm" id="confirm-cancel-${id}">Cancel</button>
          <button class="btn btn-danger btn-sm" id="confirm-delete-${id}">Delete Anyway</button>
        </div>
      `
      nodeCard.insertAdjacentElement('afterend', confirmEl)

      document.getElementById('confirm-cancel-' + id).addEventListener('click', () => confirmEl.remove())
      document.getElementById('confirm-delete-' + id).addEventListener('click', () => {
        nodes = nodes.filter(n => n.id !== id)
        routes = routes.filter(r => r.fromId !== id && r.toId !== id)
        onChange({ nodes, routes })
        render()
      })
    } else {
      nodes = nodes.filter(n => n.id !== id)
      onChange({ nodes, routes })
      render()
    }
  }

  const getRouteName = (r, nodeList) => {
    const from = nodeList.find(n => n.id === r.fromId)
    const to = nodeList.find(n => n.id === r.toId)
    return `${from?.name || '?'} → ${to?.name || '?'}`
  }

  render()
}

