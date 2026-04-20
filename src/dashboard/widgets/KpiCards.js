import {
  calcTotalMonthlyCost, calcCostPerTon, calcCostPercentRevenue, calcActiveRoutes,
  calcMonthlyTrend
} from '../../data/calculator.js'
import { formatCurrency, formatPercent, formatNumber } from '../../core/utils.js'

export function renderKpiCards(container, config) {
  const monthly       = calcTotalMonthlyCost(config)
  const annual        = monthly * 12
  const perTon        = calcCostPerTon(config)
  const pctRevenue    = calcCostPercentRevenue(config)
  const activeRoutes  = calcActiveRoutes(config)

  // Derive trend from synthetic monthly data (deterministic after BUG-4 fix)
  const industryPctAvg = 12.0
  const trend = calcMonthlyTrend(config)
  const lastMonthCost = trend.length >= 2 ? trend[trend.length - 2].total : monthly
  const thisMonthCost = trend.length >= 1 ? trend[trend.length - 1].total : monthly
  const changePercent = lastMonthCost > 0
    ? Math.abs(((thisMonthCost - lastMonthCost) / lastMonthCost) * 100).toFixed(1)
    : '0.0'
  const trendDirection = thisMonthCost >= lastMonthCost ? 'up' : 'down'

  const symbol = config.preferences?.currencySymbol || '$'

  const kpis = [
    {
      icon: '💰',
      iconClass: 'kpi-icon--blue',
      label: 'Total Monthly Cost',
      value: formatCurrency(monthly, symbol),
      trend: trendDirection,
      trendText: `${trendDirection === 'up' ? '▲' : '▼'} ${changePercent}% vs prev month`,
    },
    {
      icon: '⚖️',
      iconClass: 'kpi-icon--purple',
      label: 'Cost per Ton',
      value: perTon > 0 ? formatCurrency(perTon, symbol) : '—',
      trend: 'neutral',
      trendText: 'Per shipped ton/month',
    },
    {
      icon: '📈',
      iconClass: 'kpi-icon--green',
      label: '% of Annual Revenue',
      value: pctRevenue > 0 ? formatPercent(pctRevenue) : '—',
      trend: pctRevenue > industryPctAvg ? 'down' : 'up',
      trendText: pctRevenue > 0 ? `Industry avg: ${industryPctAvg}%` : 'Set revenue to calculate',
    },
    {
      icon: '🚚',
      iconClass: 'kpi-icon--orange',
      label: 'Active Routes',
      value: formatNumber(activeRoutes),
      trend: 'neutral',
      trendText: `${formatCurrency(activeRoutes > 0 ? monthly / activeRoutes : 0, symbol)}/route avg`,
    },
  ]

  container.innerHTML = `
    <div class="kpi-row" role="region" aria-label="Key Performance Indicators">
      ${kpis.map((k, i) => `
        <div class="kpi-card" role="status" aria-label="${k.label}" tabindex="0">
          <div class="kpi-icon ${k.iconClass}">${k.icon}</div>
          <div class="kpi-value" aria-live="polite">${k.value}</div>
          <div class="kpi-label">${k.label}</div>
          <div class="kpi-trend kpi-trend--${k.trend}">${k.trendText}</div>
        </div>
      `).join('')}
    </div>
  `
}
