import { calcRouteCosts } from '../../data/calculator.js'
import { formatCurrency } from '../../core/utils.js'
import { createHBarConfig, renderOrUpdateChart } from '../components/ChartHelpers.js'

export function renderRouteCosts(container, config) {
  const routes = calcRouteCosts(config)
  const symbol = config.preferences?.currencySymbol || '$'

  if (!routes || routes.length === 0) {
    container.innerHTML = `
      <div class="widget-empty">
        <div class="widget-empty-icon">🗺️</div>
        <div class="widget-empty-title">No route data</div>
        <div class="widget-empty-desc">Configure routes in the Supply Chain section to see cost comparison.</div>
      </div>
    `
    return
  }

  const labels     = routes.map(r => r.label)
  const data       = routes.map(r => r.monthlyCost)
  const extraData  = routes.map(r => ({ costPerKm: r.costPerKm, costPerTon: r.costPerTon }))

  container.innerHTML = `
    <div class="chart-container" style="min-height:${Math.max(200, routes.length * 52)}px">
      <canvas id="chart-routes"></canvas>
    </div>
  `

  const cfg = createHBarConfig(labels, data, extraData, symbol)

  // Store extra data on the chart config for tooltip access
  cfg.plugins = [{
    id: 'extraData',
    afterInit(chart) { chart.routeData = extraData }
  }]

  // Override tooltip to show extra data
  cfg.options.plugins.tooltip.callbacks.label = function(ctx) {
    const lines = [` Monthly: ${formatCurrency(Math.round(ctx.parsed.x), symbol)}`]
    const d = extraData[ctx.dataIndex]
    if (d?.costPerKm > 0) lines.push(` Per km: ${formatCurrency(d.costPerKm, symbol)}`)
    if (d?.costPerTon > 0) lines.push(` Per ton: ${formatCurrency(d.costPerTon, symbol)}`)
    return lines
  }

  renderOrUpdateChart('chart-routes', cfg)
}
