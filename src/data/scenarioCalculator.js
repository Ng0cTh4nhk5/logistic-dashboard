/**
 * Pure functions for scenario what-if analysis.
 * All functions take (config, adjustments) and return derived values — no side effects.
 */
import { calcCostByGroup, calcTotalMonthlyCost } from './calculator.js'

/**
 * Apply percentage adjustments to cost groups.
 * @param {object} config     — full app config
 * @param {object} adjustments — { transportation: 0.10, warehousing: -0.05, ... }
 *                               Positive = increase, negative = decrease (as decimal fraction)
 * @returns {{
 *   baseline:       { transportation, warehousing, handling, loss, admin },
 *   adjusted:       { transportation, warehousing, handling, loss, admin },
 *   baselineTotal:  number,
 *   adjustedTotal:  number,
 *   delta:          number,   // adjustedTotal - baselineTotal
 *   deltaPercent:   number,   // percentage change
 * }}
 */
export function applyScenarioAdjustments(config, adjustments) {
  const baseline = calcCostByGroup(config)
  const baselineTotal = calcTotalMonthlyCost(config)

  const adjusted = {}
  for (const [group, value] of Object.entries(baseline)) {
    const pctChange = adjustments[group] || 0
    adjusted[group] = Math.round(value * (1 + pctChange))
  }

  const adjustedTotal = Object.values(adjusted).reduce((a, b) => a + b, 0)
  const delta = adjustedTotal - baselineTotal
  const deltaPercent = baselineTotal > 0 ? (delta / baselineTotal) * 100 : 0

  return {
    baseline,
    adjusted,
    baselineTotal,
    adjustedTotal,
    delta,
    deltaPercent,
  }
}
