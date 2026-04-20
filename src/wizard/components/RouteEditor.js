import { TRANSPORT_MODES, CARRIER_TYPES } from '../../data/defaults.js'
import { generateId, sanitizeNumber, formatNumberInput, getRawNumber, escapeHtml as esc } from '../../core/utils.js'

/**
 * @param {HTMLElement} container
 * @param {Array} initialRoutes
 * @param {Array} nodes - for naming From/To dropdowns
 * @param {function} onChange(routes)
 */
export function renderRouteEditor(container, initialRoutes, nodes, onChange, symbol = '$') {
  let routes = [...(initialRoutes || [])]
  let editingId = null
  let formOpen = false

  const render = () => {
    container.innerHTML = ''

    if (routes.length > 0) {
      const list = document.createElement('div')
      list.className = 'route-list'
      routes.forEach(r => {
        const card = document.createElement('div')
        card.className = 'route-card'
        card.innerHTML = routeCardHTML(r)
        card.querySelector('.route-edit-btn').addEventListener('click', () => openForm(r.id))
        card.querySelector('.route-delete-btn').addEventListener('click', () => deleteRoute(r.id))
        list.appendChild(card)
      })
      container.appendChild(list)
    } else {
      const empty = document.createElement('div')
      empty.style.cssText = 'text-align:center;padding:var(--space-6);color:var(--color-text-muted);font-size:var(--font-size-sm)'
      empty.textContent = 'No routes added yet. Click "Add Route" below.'
      container.appendChild(empty)
    }

    const formArea = document.createElement('div')
    formArea.id = 'route-form-area'
    if (formOpen) {
      const existing = editingId ? routes.find(r => r.id === editingId) : null
      formArea.innerHTML = routeFormHTML(existing)
      formArea.querySelector('#route-save-btn').addEventListener('click', saveForm)
      formArea.querySelector('#route-cancel-btn').addEventListener('click', closeForm)
    } else {
      const addBtn = document.createElement('button')
      addBtn.className = 'btn btn-secondary btn-sm'
      addBtn.id = 'add-route-btn'
      addBtn.textContent = '+ Add Route'
      addBtn.addEventListener('click', () => openForm(null))
      formArea.appendChild(addBtn)
    }
    container.appendChild(formArea)
  }

  const routeCardHTML = (r) => {
    const from = nodes.find(n => n.id === r.fromId)
    const to = nodes.find(n => n.id === r.toId)
    const modeLabel = TRANSPORT_MODES.find(m => m.value === r.transportMode)?.label || r.transportMode
    const carrierLabel = CARRIER_TYPES.find(c => c.value === r.carrier)?.label || r.carrier
    const monthly = (Number(r.costPerTrip) || 0) * (Number(r.frequency) || 0)

    return `
      <div class="route-card-header">
        <div class="route-card-path">
          <span>${esc(from?.name || '?')}</span>
          <span class="route-card-arrow">→</span>
          <span>${esc(to?.name || '?')}</span>
        </div>
        <div style="display:flex;gap:var(--space-1)">
          <button class="btn btn-ghost btn-icon btn-sm route-edit-btn" title="Edit route" aria-label="Edit route">✎</button>
          <button class="btn btn-ghost btn-icon btn-sm route-delete-btn" title="Delete route" style="color:var(--color-danger)" aria-label="Delete route">✕</button>
        </div>
      </div>
      <div class="route-card-meta">
        <span class="route-tag">📏 ${Number(r.distance || 0).toLocaleString()} ${esc(r.distanceUnit || 'km')}</span>
        <span class="route-tag">${esc(modeLabel?.split(' ').slice(1).join(' '))}</span>
        <span class="route-tag">🤝 ${esc(carrierLabel)}</span>
        <span class="route-tag">🔄 ${r.frequency || 0}×/mo</span>
        <span class="route-tag">💰 ${symbol}${Number(r.costPerTrip).toLocaleString()}/trip</span>
        <span class="route-tag">📦 ${r.volumePerTrip || 0} ${esc(r.volumeUnit || 'ton')}/trip</span>
      </div>
    `
  }

  const nodeOptions = (selectedId) => {
    if (!nodes.length) return `<option value="">— Add locations first —</option>`
    return nodes.map(n => `<option value="${n.id}" ${n.id === selectedId ? 'selected' : ''}>${esc(n.name)}</option>`).join('')
  }

  const routeFormHTML = (existing) => {
    const r = existing || {}
    return `
      <div class="route-form">
        <div class="node-form-title">${existing ? 'Edit Route' : 'Add Route'}</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="route-from">From *</label>
            <select id="route-from">${nodeOptions(r.fromId)}</select>
          </div>
          <div class="form-group">
            <label class="form-label" for="route-to">To *</label>
            <select id="route-to">${nodeOptions(r.toId)}</select>
          </div>
          <div class="form-group">
            <label class="form-label" for="route-distance">Distance</label>
            <input type="text" inputmode="numeric" id="route-distance" placeholder="e.g. 850" data-raw-value="${r.distance || ''}" value="${r.distance ? Number(r.distance).toLocaleString('en-US') : ''}">
          </div>
          <div class="form-group">
            <label class="form-label" for="route-dist-unit">Distance Unit</label>
            <select id="route-dist-unit">
              <option value="km" ${r.distanceUnit !== 'mi' ? 'selected' : ''}>Kilometer (km)</option>
              <option value="mi" ${r.distanceUnit === 'mi' ? 'selected' : ''}>Mile (mi)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="route-mode">Transport Mode</label>
            <select id="route-mode">
              ${TRANSPORT_MODES.map(m => `<option value="${m.value}" ${r.transportMode === m.value ? 'selected' : ''}>${m.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="route-carrier">Carrier Type</label>
            <select id="route-carrier">
              ${CARRIER_TYPES.map(c => `<option value="${c.value}" ${r.carrier === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="route-frequency">Frequency (per month)</label>
            <input type="number" id="route-frequency" min="0" step="1" placeholder="e.g. 12" value="${r.frequency || ''}">
          </div>
          <div class="form-group">
            <label class="form-label" for="route-cost">Cost per Trip (${symbol})</label>
            <input type="text" inputmode="numeric" id="route-cost" placeholder="e.g. 4,500" data-raw-value="${r.costPerTrip || ''}" value="${r.costPerTrip ? Number(r.costPerTrip).toLocaleString('en-US') : ''}">
          </div>
          <div class="form-group">
            <label class="form-label" for="route-volume">Volume per Trip (ton)</label>
            <input type="number" id="route-volume" min="0" step="any" placeholder="e.g. 22" value="${r.volumePerTrip || ''}">
          </div>
        </div>
        <div class="route-form-actions">
          <button class="btn btn-ghost btn-sm" id="route-cancel-btn">Cancel</button>
          <button class="btn btn-primary btn-sm" id="route-save-btn">${existing ? 'Save Changes' : 'Add Route'}</button>
        </div>
      </div>
    `
  }

  const openForm = (id) => { 
    editingId = id; formOpen = true; render()
    document.getElementById('route-from')?.focus()
    // Attach format to numeric text inputs
    const distInput = document.getElementById('route-distance')
    const costInput = document.getElementById('route-cost')
    if (distInput) formatNumberInput(distInput)
    if (costInput) formatNumberInput(costInput)
  }
  const closeForm = () => { formOpen = false; editingId = null; render(); document.getElementById('add-route-btn')?.focus() }

  const saveForm = () => {
    const area = document.getElementById('route-form-area')
    const fromId = area.querySelector('#route-from').value
    const toId = area.querySelector('#route-to').value

    // Warn on duplicate (don't block)
    const isDuplicate = routes.some(r => r.fromId === fromId && r.toId === toId && r.id !== editingId)
    const duplicateWarn = area.querySelector('#route-duplicate-warn')
    if (isDuplicate && !duplicateWarn) {
      const warn = document.createElement('p')
      warn.id = 'route-duplicate-warn'
      warn.style.cssText = 'color:var(--color-warning);font-size:var(--font-size-xs);margin-bottom:var(--space-2)'
      warn.textContent = 'Note: A route between these locations already exists.'
      area.querySelector('.route-form-actions').insertAdjacentElement('beforebegin', warn)
    }

    if (!fromId || !toId) {
      alert('Please select origin and destination.'); return
    }
    if (fromId === toId) {
      alert('Origin and destination cannot be the same location.'); return
    }

    const route = {
      id: editingId || generateId('r'),
      fromId, toId,
      distance: getRawNumber(area.querySelector('#route-distance')),
      distanceUnit: area.querySelector('#route-dist-unit').value,
      transportMode: area.querySelector('#route-mode').value,
      carrier: area.querySelector('#route-carrier').value,
      frequency: sanitizeNumber(area.querySelector('#route-frequency').value, { integer: true }),
      frequencyUnit: 'per-month',
      costPerTrip: getRawNumber(area.querySelector('#route-cost')),
      volumePerTrip: sanitizeNumber(area.querySelector('#route-volume').value),
      volumeUnit: 'ton',
    }

    if (editingId) {
      const idx = routes.findIndex(r => r.id === editingId)
      if (idx !== -1) routes[idx] = route
    } else {
      routes.push(route)
    }

    closeForm()
    onChange(routes)
  }

  const deleteRoute = (id) => {
    routes = routes.filter(r => r.id !== id)
    onChange(routes)
    render()
  }

  render()
}
