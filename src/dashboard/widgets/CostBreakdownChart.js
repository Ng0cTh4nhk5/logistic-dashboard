import { calcCostByGroup, calcTotalMonthlyCost } from '../../data/calculator.js'
import { formatCurrency } from '../../core/utils.js'
import { CHART_COLORS, GROUP_LABELS, createDoughnutConfig, renderOrUpdateChart, createCenterTextPlugin } from '../components/ChartHelpers.js'

export function renderCostBreakdown(container, config) {
  const byGroup = calcCostByGroup(config)
  const total   = calcTotalMonthlyCost(config)
  const symbol  = config.preferences?.currencySymbol || '$'

  if (total === 0) {
    container.innerHTML = `
      <div class="widget-empty">
        <div class="widget-empty-icon">📊</div>
        <div class="widget-empty-title">No cost data</div>
        <div class="widget-empty-desc">Enable cost categories to see the breakdown chart.</div>
      </div>
    `
    return
  }

  const groups = Object.keys(CHART_COLORS)
  const labels = groups.map(k => GROUP_LABELS[k])
  const data   = groups.map(k => byGroup[k] || 0)
  const colors = groups.map(k => CHART_COLORS[k])

  container.innerHTML = `
    <div class="donut-layout">
      <div class="donut-chart-wrap">
        <canvas id="chart-breakdown"></canvas>
      </div>
      <div class="donut-legend">
        ${groups.map((k, i) => {
          const val = byGroup[k] || 0
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0'
          return `
            <div class="donut-legend-item">
              <div class="donut-legend-color" style="background:${colors[i]}"></div>
              <div class="donut-legend-name">${labels[i]}</div>
              <div class="donut-legend-amount">${formatCurrency(val, symbol)}</div>
              <div class="donut-legend-pct">${pct}%</div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `

  const cfg = createDoughnutConfig(labels, data, colors, symbol)
  const isMobile = window.innerWidth < 768
  cfg.options.cutout = isMobile ? '50%' : '65%'

  renderOrUpdateChart('chart-breakdown', cfg, [createCenterTextPlugin(symbol)])
}
