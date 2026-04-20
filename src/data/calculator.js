/**
 * Calculation engine. All functions pure: (config) → derived value.
 * Always returns 0 (not NaN) when data is empty or incomplete.
 */

// ─── Totals ───────────────────────────────────────────────────────────────────

export function calcTotalMonthlyCost(config) {
  if (!config?.costCategories?.length) return 0
  return config.costCategories
    .filter(c => c.enabled)
    .reduce((sum, c) => sum + (Number(c.monthlyCost) || 0), 0)
}

export function calcTotalAnnualCost(config) {
  return calcTotalMonthlyCost(config) * 12
}

// ─── Per-unit metrics ──────────────────────────────────────────────────────────

export function calcTotalMonthlyVolume(config) {
  if (!config?.routes?.length) return 0
  return config.routes.reduce((sum, r) => {
    const freq = normalizeFrequencyToMonthly(r.frequency, r.frequencyUnit)
    return sum + (Number(r.volumePerTrip) || 0) * freq
  }, 0)
}

export function calcCostPerTon(config) {
  const total = calcTotalMonthlyCost(config)
  const volume = calcTotalMonthlyVolume(config)
  return volume > 0 ? total / volume : 0
}

export function calcCostPercentRevenue(config) {
  const annual = calcTotalAnnualCost(config)
  const revenue = Number(config?.company?.annualRevenue) || 0
  if (revenue <= 0) return 0
  return (annual / revenue) * 100
}

export function calcActiveRoutes(config) {
  return config?.routes?.length || 0
}

// ─── Group breakdown ──────────────────────────────────────────────────────────

export function calcCostByGroup(config) {
  const groups = { transportation: 0, warehousing: 0, handling: 0, loss: 0, admin: 0 }
  if (!config?.costCategories?.length) return groups

  config.costCategories
    .filter(c => c.enabled)
    .forEach(c => {
      if (c.group in groups) {
        groups[c.group] += Number(c.monthlyCost) || 0
      } else {
        groups.admin += Number(c.monthlyCost) || 0 // unknown groups → admin
      }
    })
  return groups
}

export function calcCostByGroupPercent(config) {
  const byGroup = calcCostByGroup(config)
  const total = Object.values(byGroup).reduce((a, b) => a + b, 0)
  if (total === 0) return { transportation: 0, warehousing: 0, handling: 0, loss: 0, admin: 0 }
  const result = {}
  for (const [key, val] of Object.entries(byGroup)) {
    result[key] = (val / total) * 100
  }
  return result
}

// ─── Route costs ──────────────────────────────────────────────────────────────

export function calcRouteCosts(config) {
  if (!config?.routes?.length) return []
  const nodes = config.nodes || []
  const getNode = id => nodes.find(n => n.id === id)

  return config.routes.map(r => {
    const from = getNode(r.fromId)
    const to = getNode(r.toId)
    const freq = normalizeFrequencyToMonthly(r.frequency, r.frequencyUnit)
    const monthlyCost = (Number(r.costPerTrip) || 0) * freq
    const distance = Number(r.distance) || 1
    const volume = (Number(r.volumePerTrip) || 0) * freq

    return {
      id: r.id,
      label: `${from?.name || '?'} → ${to?.name || '?'}`,
      monthlyCost,
      costPerKm: (Number(r.costPerTrip) || 0) / distance,
      costPerTon: volume > 0 ? monthlyCost / volume : 0,
      tripsPerMonth: freq,
      distance: r.distance,
      distanceUnit: r.distanceUnit,
      carrier: r.carrier,
      transportMode: r.transportMode,
    }
  }).sort((a, b) => b.monthlyCost - a.monthlyCost) // Descending by cost
}

// ─── Monthly trend ────────────────────────────────────────────────────────────

export function calcMonthlyTrend(config) {
  // If real data exists, use it
  if (config?.costData?.monthly?.length >= 12) {
    return config.costData.monthly.slice(-12)
  }
  // Otherwise generate synthetic trend data
  return generateMonthlyTrend(config)
}

export function generateMonthlyTrend(config) {
  const baseline = calcTotalMonthlyCost(config)
  const byGroup = calcCostByGroup(config)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  // Seasonal factors: Q4 typically higher
  const seasonalFactors = [0.95, 0.92, 0.97, 0.99, 1.01, 1.02, 1.03, 1.01, 1.00, 1.03, 1.08, 1.12]

  return months.map((label, i) => {
    const seasonal = seasonalFactors[i]
    // Deterministic pseudo-random: same config → same chart every time
    const seed = Math.abs(Math.sin((i + 1) * 9301 + (baseline % 9999) * 49297))
    const noise = 1 + (seed * 0.14 - 0.07)
    const factor = seasonal * noise

    const total = Math.round(baseline * factor)
    const groupTotal = Object.values(byGroup).reduce((a,b) => a+b, 0)

    let groupData = {}
    if (groupTotal > 0) {
      for (const [key, val] of Object.entries(byGroup)) {
        groupData[key] = Math.round(val * factor)
      }
    }

    return {
      period: `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`,
      label,
      total,
      byGroup: groupData,
    }
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeFrequencyToMonthly(frequency, unit) {
  const f = Number(frequency) || 0
  switch (unit) {
    case 'per-day':  return f * 30
    case 'per-week': return f * 4.33
    case 'per-month':
    default:         return f
  }
}
