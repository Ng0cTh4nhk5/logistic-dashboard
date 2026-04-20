import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export const CHART_COLORS = {
  transportation: '#3B82F6',
  warehousing:    '#8B5CF6',
  handling:       '#F59E0B',
  loss:           '#EF4444',
  admin:          '#10B981',
}

export const CHART_COLORS_ARRAY = [
  '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'
]

export const GROUP_LABELS = {
  transportation: 'Transportation',
  warehousing:    'Warehousing',
  handling:       'Handling',
  loss:           'Loss & Damage',
  admin:          'Administration',
}

// Track chart instances to destroy before re-creating
const chartInstances = {}

export function applyChartDefaults() {
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif"
  Chart.defaults.font.size = 13
  Chart.defaults.color = '#64748B'
  Chart.defaults.responsive = true
  Chart.defaults.maintainAspectRatio = false
  Chart.defaults.animation.duration = 800
  Chart.defaults.animation.easing = 'easeOutQuart'

  Chart.defaults.plugins.legend.labels.usePointStyle = true
  Chart.defaults.plugins.legend.labels.padding = 16

  Chart.defaults.plugins.tooltip.backgroundColor = '#FFFFFF'
  Chart.defaults.plugins.tooltip.titleColor = '#0F172A'
  Chart.defaults.plugins.tooltip.bodyColor = '#64748B'
  Chart.defaults.plugins.tooltip.borderColor = '#E2E8F0'
  Chart.defaults.plugins.tooltip.borderWidth = 1
  Chart.defaults.plugins.tooltip.cornerRadius = 8
  Chart.defaults.plugins.tooltip.padding = 12
  Chart.defaults.plugins.tooltip.usePointStyle = true
  Chart.defaults.plugins.tooltip.displayColors = true
}

export function renderOrUpdateChart(canvasId, config, plugins = []) {
  // Destroy existing chart on this canvas
  if (chartInstances[canvasId]) {
    try { chartInstances[canvasId].destroy() } catch {}
    delete chartInstances[canvasId]
  }

  const canvas = document.getElementById(canvasId)
  if (!canvas) return null

  const chart = new Chart(canvas.getContext('2d'), { ...config, plugins })
  chartInstances[canvasId] = chart
  return chart
}

export function destroyAllCharts() {
  Object.keys(chartInstances).forEach(id => {
    try { chartInstances[id].destroy() } catch {}
    delete chartInstances[id]
  })
}

export function createDoughnutConfig(labels, data, colors, symbol = '$') {
  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverBorderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      cutout: '65%',
      radius: '90%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
              const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0'
              return ` ${ctx.label}: ${symbol}${ctx.parsed.toLocaleString()} (${pct}%)`
            }
          }
        }
      }
    }
  }
}

export function createLineConfig(labels, dataset, symbol = '$') {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Cost',
        data: dataset,
        borderColor: '#2563EB',
        borderWidth: 2.5,
        fill: true,
        backgroundColor: 'rgba(37,99,235,0.07)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#2563EB',
        pointHoverBorderWidth: 2,
      }]
    },
    options: {
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 } }
        },
        y: {
          beginAtZero: false,
          grid: { color: '#E2E8F0', drawBorder: false, borderDash: [4, 4] },
          ticks: {
            callback: val => symbol + (val >= 1000 ? (val/1000).toFixed(0)+'K' : val),
            font: { size: 12 },
            maxTicksLimit: 6,
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          interaction: { intersect: false, mode: 'index' },
          callbacks: {
            title: items => items[0].label,
            label: ctx => ` Total: ${symbol}${Math.round(ctx.parsed.y).toLocaleString()}`
          }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  }
}

export function createHBarConfig(labels, data, extraData = [], symbol = '$') {
  const maxVal = Math.max(...data, 1)
  const colors = data.map(val => {
    const intensity = 0.3 + (val / maxVal) * 0.7
    return `rgba(37,99,235,${intensity.toFixed(2)})`
  })

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 26,
        maxBarThickness: 34,
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#E2E8F0', drawBorder: false, borderDash: [4, 4] },
          ticks: {
            callback: val => symbol + (val >= 1000 ? (val/1000).toFixed(0)+'K' : val),
            font: { size: 12 },
            maxTicksLimit: 5,
          }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 12, weight: '500' }, crossAlign: 'far' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => items[0].label,
            label(ctx) {
              const lines = [` Monthly: ${symbol}${Math.round(ctx.parsed.x).toLocaleString()}`]
              if (extraData[ctx.dataIndex]) {
                const d = extraData[ctx.dataIndex]
                if (d.costPerKm > 0) lines.push(` Per km: ${symbol}${d.costPerKm.toFixed(1)}`)
                if (d.costPerTon > 0) lines.push(` Per ton: ${symbol}${d.costPerTon.toFixed(0)}`)
              }
              return lines
            }
          }
        }
      }
    }
  }
}

// Center text plugin for doughnut chart — factory to inject currency symbol
export function createCenterTextPlugin(symbol = '$') {
  return {
    id: 'centerText',
    beforeDraw(chart) {
      if (chart.config.type !== 'doughnut') return
      const { ctx, width, height } = chart
      const total = chart.data.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0

      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const cx = width / 2
      const cy = height / 2

      ctx.font = `400 12px Inter, system-ui, sans-serif`
      ctx.fillStyle = '#94A3B8'
      ctx.fillText('Monthly Total', cx, cy - 14)

      ctx.font = `700 20px Inter, system-ui, sans-serif`
      ctx.fillStyle = '#0F172A'
      ctx.fillText(symbol + total.toLocaleString(), cx, cy + 10)

      ctx.restore()
    }
  }
}
