/**
 * Supply Chain Map — Network Graph (pure SVG)
 * Renders nodes and routes as an interactive directed graph.
 * Layout: hierarchical left→right by node type (Factory → Warehouse → Customer).
 * No external dependencies required.
 */
import { calcRouteCosts } from '../../data/calculator.js'
import { formatCurrency, escapeHtml as esc } from '../../core/utils.js'

// ─── Styling ──────────────────────────────────────────────────────────────────
const TYPE_COLORS  = { factory: '#2563EB', warehouse: '#8B5CF6', dc: '#F59E0B', port: '#06B6D4', customer: '#059669' }
const TYPE_ICONS   = { factory: '🏭', warehouse: '🏢', dc: '📦', port: '⚓', customer: '🏪' }
const TYPE_LABELS  = { factory: 'Factory', warehouse: 'Warehouse', dc: 'Distribution Center', port: 'Port', customer: 'Customer' }
const TYPE_LAYER   = { factory: 0, warehouse: 1, dc: 1, port: 2, customer: 3 }

const SVG_W = 900
const SVG_H = 440
const PAD_X = 100
const PAD_Y = 65
const NODE_R = 22

// ─── Main export ──────────────────────────────────────────────────────────────
export function renderSupplyChainMap(container, config) {
  const nodes  = config.nodes  || []
  const routes = config.routes || []
  const symbol = config.preferences?.currencySymbol || '$'

  // ── Empty state ───────────────────────────────────────────────────────────
  if (nodes.length === 0) {
    container.innerHTML = `
      <div class="widget-empty">
        <div class="widget-empty-icon">🗺️</div>
        <div class="widget-empty-title">No locations configured</div>
        <div class="widget-empty-desc">Add locations in Settings → Supply Chain to visualize your network.</div>
      </div>
    `
    return
  }

  // ── Route cost data ───────────────────────────────────────────────────────
  const routeCosts = calcRouteCosts(config)
  const maxCost = Math.max(...routeCosts.map(r => r.monthlyCost), 1)

  // ── Hierarchical layout: group nodes by type-layer ────────────────────────
  const layers = {}
  nodes.forEach(n => {
    const layer = TYPE_LAYER[n.type] ?? 2
    if (!layers[layer]) layers[layer] = []
    layers[layer].push(n)
  })

  const usedLayers = Object.keys(layers).map(Number).sort((a, b) => a - b)
  const positions  = {}  // nodeId → { x, y }

  if (usedLayers.length === 1) {
    // Single layer → spread horizontally
    const group   = layers[usedLayers[0]]
    const spacing = group.length > 1 ? (SVG_W - PAD_X * 2) / (group.length - 1) : 0
    group.forEach((n, i) => {
      positions[n.id] = {
        x: group.length === 1 ? SVG_W / 2 : PAD_X + i * spacing,
        y: SVG_H / 2,
      }
    })
  } else {
    const colSpacing = (SVG_W - PAD_X * 2) / (usedLayers.length - 1)
    usedLayers.forEach((layerKey, colIdx) => {
      const group = layers[layerKey]
      const x = PAD_X + colIdx * colSpacing
      const rowSpacing = group.length > 1 ? (SVG_H - PAD_Y * 2) / (group.length - 1) : 0
      group.forEach((n, rowIdx) => {
        positions[n.id] = {
          x,
          y: group.length === 1 ? SVG_H / 2 : PAD_Y + rowIdx * rowSpacing,
        }
      })
    })
  }

  // ── Build edge SVG ────────────────────────────────────────────────────────
  // Track pairs to offset overlapping routes
  const pairIndex = {}

  let edgeSVG = ''
  routes.forEach(route => {
    const from = positions[route.fromId]
    const to   = positions[route.toId]
    if (!from || !to) return

    const rd   = routeCosts.find(r => r.id === route.id)
    const cost = rd?.monthlyCost || 0
    const strokeW = 2 + (cost / maxCost) * 4

    // Offset for multiple routes between same pair
    const pairKey = [route.fromId, route.toId].sort().join(':')
    pairIndex[pairKey] = (pairIndex[pairKey] || 0) + 1
    const pairOff = pairIndex[pairKey] - 1

    // Quadratic bezier control point — bows perpendicular to the line
    const dx   = to.x - from.x
    const dy   = to.y - from.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const bowScale = 0.12 + pairOff * 0.14  // increase bow for duplicate pairs
    const perpX = (-dy / dist) * dist * bowScale
    const perpY = ( dx / dist) * dist * bowScale
    const cx = (from.x + to.x) / 2 + perpX
    const cy = (from.y + to.y) / 2 + perpY

    // Adjust start/end to node border circle
    const startA = Math.atan2(cy - from.y, cx - from.x)
    const endA   = Math.atan2(to.y - cy, to.x - cx)
    const sx = from.x + Math.cos(startA) * (NODE_R + 2)
    const sy = from.y + Math.sin(startA) * (NODE_R + 2)
    const ex = to.x   - Math.cos(endA)   * (NODE_R + 2)
    const ey = to.y   - Math.sin(endA)   * (NODE_R + 2)

    const dashAttr   = route.carrier === '3pl' ? 'stroke-dasharray="8 4"' : ''
    const fromNode   = nodes.find(n => n.id === route.fromId)
    const toNode     = nodes.find(n => n.id === route.toId)
    const tipLines   = [
      `${fromNode?.name || '?'} → ${toNode?.name || '?'}`,
      `${route.distance || 0} ${route.distanceUnit || 'km'} · ${route.frequency || 0}×/mo`,
      `${formatCurrency(cost, symbol)}/month`,
    ]
    if (route.carrier === '3pl') tipLines.push('3PL carrier (dashed)')

    edgeSVG += `
      <path class="graph-edge"
            d="M${sx.toFixed(1)},${sy.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}"
            stroke="#3B82F6" stroke-width="${strokeW.toFixed(1)}"
            fill="none" stroke-opacity="0.45" stroke-linecap="round"
            marker-end="url(#graph-arrow)"
            ${dashAttr}
            data-route-id="${route.id}">
        <title>${esc(tipLines.join('\n'))}</title>
      </path>
    `
  })

  // ── Build node SVG ────────────────────────────────────────────────────────
  let nodeSVG = ''
  nodes.forEach(node => {
    const pos   = positions[node.id]
    if (!pos) return
    const color = TYPE_COLORS[node.type] || '#6B7280'
    const icon  = TYPE_ICONS[node.type]  || '📍'
    const label = node.name.length > 18 ? node.name.slice(0, 16) + '…' : node.name
    const addr  = node.address
      ? (node.address.length > 24 ? node.address.slice(0, 22) + '…' : node.address)
      : ''

    const tipLines = [node.name, TYPE_LABELS[node.type] || node.type]
    if (node.address) tipLines.push(node.address)

    nodeSVG += `
      <g class="graph-node" data-node-id="${node.id}" transform="translate(${pos.x},${pos.y})">
        <circle class="graph-node-bg" r="${NODE_R}" fill="${color}" fill-opacity="0.10" stroke="${color}" stroke-width="2.5" />
        <text class="graph-node-icon" text-anchor="middle" dominant-baseline="central" font-size="17"
              style="pointer-events:none">${icon}</text>
        <text class="graph-node-label" y="${NODE_R + 15}" text-anchor="middle"
              font-size="11" font-weight="600" fill="var(--color-text, #0F172A)"
              style="pointer-events:none">${esc(label)}</text>
        ${addr ? `<text class="graph-node-sublabel" y="${NODE_R + 28}" text-anchor="middle"
              font-size="9" fill="var(--color-text-muted, #94A3B8)"
              style="pointer-events:none">${esc(addr)}</text>` : ''}
        <title>${esc(tipLines.join('\n'))}</title>
      </g>
    `
  })

  // ── Type legend ───────────────────────────────────────────────────────────
  const usedTypes = [...new Set(nodes.map(n => n.type))]
  const legendHTML = usedTypes.map(t => `
    <div class="graph-legend-item">
      <span class="graph-legend-dot" style="background:${TYPE_COLORS[t]}"></span>
      <span>${TYPE_ICONS[t] || ''} ${TYPE_LABELS[t] || t}</span>
    </div>
  `).join('')

  // Route style legend (solid vs dashed)
  const has3pl     = routes.some(r => r.carrier === '3pl')
  const hasInhouse = routes.some(r => r.carrier !== '3pl')
  let routeLegend  = ''
  if (hasInhouse) routeLegend += '<div class="graph-legend-item"><span class="graph-legend-line"></span><span>In-house</span></div>'
  if (has3pl)     routeLegend += '<div class="graph-legend-item"><span class="graph-legend-line graph-legend-line--dashed"></span><span>3PL</span></div>'

  // ── Compose HTML ──────────────────────────────────────────────────────────
  container.innerHTML = `
    <div class="graph-wrap">
      <svg class="supply-chain-graph" viewBox="0 0 ${SVG_W} ${SVG_H}" preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Supply chain network graph">
        <defs>
          <marker id="graph-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4"
                  orient="auto" markerUnits="userSpaceOnUse">
            <polygon points="0 0, 10 4, 0 8" fill="#3B82F6" fill-opacity="0.65" />
          </marker>
        </defs>
        <g class="graph-edges">${edgeSVG}</g>
        <g class="graph-nodes">${nodeSVG}</g>
      </svg>
      <div class="graph-legend">${legendHTML}${routeLegend}</div>
    </div>
  `

  // ── Interactive hover: highlight node + its edges ─────────────────────────
  const svg = container.querySelector('.supply-chain-graph')

  svg.querySelectorAll('.graph-node').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const id = el.dataset.nodeId
      el.classList.add('graph-node--active')

      svg.querySelectorAll('.graph-edge').forEach(edge => {
        const rId   = edge.dataset.routeId
        const route = routes.find(r => r.id === rId)
        if (route && (route.fromId === id || route.toId === id)) {
          edge.classList.add('graph-edge--active')
        } else {
          edge.classList.add('graph-edge--dim')
        }
      })
      svg.querySelectorAll('.graph-node').forEach(other => {
        if (other !== el) other.classList.add('graph-node--dim')
      })
    })

    el.addEventListener('mouseleave', () => {
      svg.querySelectorAll('.graph-node--active,.graph-node--dim,.graph-edge--active,.graph-edge--dim')
        .forEach(e => e.classList.remove('graph-node--active', 'graph-node--dim', 'graph-edge--active', 'graph-edge--dim'))
    })
  })
}
