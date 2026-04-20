import { renderNodeEditor } from '../components/NodeEditor.js'
import { renderRouteEditor } from '../components/RouteEditor.js'

export const SupplyChainStep = {
  render(container, data, onUpdate) {
    const nodes = data?.nodes || []
    const routes = data?.routes || []
    const symbol = data?.symbol || '$'

    container.innerHTML = `
      <div class="step-heading">
        <h2>🔗 Supply Chain Network</h2>
        <p>Map your logistics network — factories, warehouses, customer points, and the routes connecting them.</p>
      </div>
      <div id="supplychain-validation"></div>

      <div style="margin-bottom:var(--space-8)">
        <div class="section-title" style="margin-bottom:var(--space-4)">📍 Locations</div>
        <div id="node-editor-container"></div>
      </div>

      <hr class="divider">

      <div>
        <div class="section-title" style="margin-bottom:var(--space-4)">🔗 Routes</div>
        <div id="route-editor-container"></div>
      </div>
    `

    let currentNodes = [...nodes]
    let currentRoutes = [...routes]

    // Render NodeEditor
    renderNodeEditor(
      container.querySelector('#node-editor-container'),
      currentNodes,
      currentRoutes,
      ({ nodes: n, routes: r }) => {
        currentNodes = n
        currentRoutes = r
        // Re-render route editor so its node dropdowns update
        renderRouteEditor(
          container.querySelector('#route-editor-container'),
          currentRoutes,
          currentNodes,
          (updatedRoutes) => {
            currentRoutes = updatedRoutes
            onUpdate({ nodes: currentNodes, routes: currentRoutes })
          },
          symbol
        )
        onUpdate({ nodes: currentNodes, routes: currentRoutes })
      },
      symbol
    )

    // Render RouteEditor
    renderRouteEditor(
      container.querySelector('#route-editor-container'),
      currentRoutes,
      currentNodes,
      (updatedRoutes) => {
        currentRoutes = updatedRoutes
        onUpdate({ nodes: currentNodes, routes: currentRoutes })
      },
      symbol
    )
  },

  validate(data) {
    const errors = []
    const nodes = data?.nodes || []
    const routes = data?.routes || []

    const hasFactory = nodes.some(n => n.type === 'factory')
    const hasCustomer = nodes.some(n => n.type === 'customer')

    if (!hasFactory || !hasCustomer) {
      errors.push('Add at least one Factory and one Customer location')
    }
    if (routes.length === 0) {
      errors.push('Add at least one route connecting locations')
    }
    routes.forEach((r, i) => {
      if (!r.distance || r.distance <= 0) errors.push(`Route ${i + 1}: distance must be positive`)
      if (!r.costPerTrip || r.costPerTrip <= 0) errors.push(`Route ${i + 1}: cost per trip must be positive`)
      if (!r.frequency || r.frequency <= 0) errors.push(`Route ${i + 1}: frequency must be positive`)
    })
    return { valid: errors.length === 0, errors }
  }
}
