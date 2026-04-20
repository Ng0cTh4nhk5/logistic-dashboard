import { calcMonthlyTrend } from '../../data/calculator.js'
import { formatCurrency } from '../../core/utils.js'
import { createLineConfig, renderOrUpdateChart } from '../components/ChartHelpers.js'

export function renderCostTrend(container, config) {
  const trend = calcMonthlyTrend(config)
  const symbol = config.preferences?.currencySymbol || '$'

  if (!trend || trend.length === 0) {
    container.innerHTML = `
      <div class="widget-empty">
        <div class="widget-empty-icon">📉</div>
        <div class="widget-empty-title">No trend data</div>
        <div class="widget-empty-desc">Configure cost categories to see the monthly trend.</div>
      </div>
    `
    return
  }

  const labels  = trend.map(t => t.label)
  const dataset = trend.map(t => t.total)
  const max = Math.max(...dataset)
  const min = Math.min(...dataset)
  const avg = Math.round(dataset.reduce((a, b) => a + b, 0) / dataset.length)

  container.innerHTML = `
    <div style="display:flex;gap:var(--space-6);margin-bottom:var(--space-4)">
      <div>
        <div style="font-size:var(--font-size-xl);font-weight:700">${formatCurrency(avg, symbol)}</div>
        <div style="font-size:var(--font-size-xs);color:var(--color-text-muted)">12-mo average</div>
      </div>
      <div>
        <div style="font-size:var(--font-size-sm);font-weight:600;color:var(--color-success)">▼ ${formatCurrency(min, symbol)}</div>
        <div style="font-size:var(--font-size-xs);color:var(--color-text-muted)">Best month</div>
      </div>
      <div>
        <div style="font-size:var(--font-size-sm);font-weight:600;color:var(--color-danger)">▲ ${formatCurrency(max, symbol)}</div>
        <div style="font-size:var(--font-size-xs);color:var(--color-text-muted)">Peak month</div>
      </div>
    </div>
    <div class="chart-container">
      <canvas id="chart-trend"></canvas>
    </div>
  `

  const cfg = createLineConfig(labels, dataset, symbol)

  // Override tooltip to include symbol
  cfg.options.plugins.tooltip.callbacks.label = ctx =>
    ` Total: ${formatCurrency(Math.round(ctx.parsed.y), symbol)}`

  renderOrUpdateChart('chart-trend', cfg)
}
