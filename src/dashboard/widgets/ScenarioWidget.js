import { applyScenarioAdjustments } from '../../data/scenarioCalculator.js'
import { calcCostByGroup, calcTotalMonthlyCost } from '../../data/calculator.js'
import { formatCurrency, generateId, deepClone, showToast, escapeHtml as esc } from '../../core/utils.js'
import { Store } from '../../core/store.js'
import { CHART_COLORS, GROUP_LABELS } from '../components/ChartHelpers.js'

const GROUPS = ['transportation', 'warehousing', 'handling', 'loss', 'admin']

export function renderScenarioWidget(container, config) {
  const symbol = config.preferences?.currencySymbol || '$'
  const total  = calcTotalMonthlyCost(config)
  const byGroup = calcCostByGroup(config)

  // ── Empty state ───────────────────────────────────────────────────────────
  if (total === 0) {
    container.innerHTML = `
      <div class="widget-empty">
        <div class="widget-empty-icon">📊</div>
        <div class="widget-empty-title">No cost data</div>
        <div class="widget-empty-desc">Enable and fill in cost categories in Settings to use scenario analysis.</div>
      </div>
    `
    return
  }

  // Active groups (those with cost > 0)
  const activeGroups = GROUPS.filter(g => (byGroup[g] || 0) > 0)

  // Current slider adjustments — start at 0%
  const adjustments = {}
  GROUPS.forEach(g => adjustments[g] = 0)

  // Render and bind events
  const render = () => {
    const result   = applyScenarioAdjustments(config, adjustments)
    const scenarios = config.scenarios || []

    container.innerHTML = `
      <div class="scenario-layout">

        <!-- LEFT: Sliders -->
        <div class="scenario-sliders">
          <div class="scenario-sliders-title">Adjust cost groups</div>
          ${activeGroups.map(group => {
            const pctInt    = Math.round(adjustments[group] * 100)
            const pctDisplay = (pctInt >= 0 ? '+' : '') + pctInt + '%'
            const baseVal   = byGroup[group] || 0
            const newVal    = result.adjusted[group]
            const isUp      = newVal > baseVal
            const isDown    = newVal < baseVal
            return `
              <div class="scenario-slider-row">
                <div class="scenario-slider-header">
                  <span class="scenario-slider-dot" style="background:${CHART_COLORS[group]}"></span>
                  <span class="scenario-slider-label">${GROUP_LABELS[group]}</span>
                  <span class="scenario-slider-pct ${isUp ? 'pct--up' : isDown ? 'pct--down' : ''}">${pctDisplay}</span>
                </div>
                <input type="range" class="scenario-range" data-group="${group}"
                       min="-50" max="100" value="${pctInt}" step="5"
                       aria-label="Adjust ${GROUP_LABELS[group]} by percentage">
                <div class="scenario-slider-values">
                  <span class="scenario-val-base">${formatCurrency(baseVal, symbol)}</span>
                  <span class="scenario-val-arrow">→</span>
                  <span class="scenario-val-new ${isUp ? 'val--up' : isDown ? 'val--down' : ''}">
                    ${formatCurrency(newVal, symbol)}
                  </span>
                </div>
              </div>
            `
          }).join('')}

          <button class="btn btn-ghost btn-sm scenario-reset-btn" id="scenario-reset-btn">
            ↺ Reset all sliders
          </button>
        </div>

        <!-- RIGHT: Summary -->
        <div class="scenario-summary">
          <!-- Before / After comparison -->
          <div class="scenario-comparison">
            <div class="scenario-compare-item">
              <div class="scenario-compare-label">Current Monthly</div>
              <div class="scenario-compare-value">${formatCurrency(result.baselineTotal, symbol)}</div>
            </div>
            <div class="scenario-compare-arrow">→</div>
            <div class="scenario-compare-item scenario-compare-item--result">
              <div class="scenario-compare-label">Projected Monthly</div>
              <div class="scenario-compare-value ${result.delta > 0 ? 'val--up' : result.delta < 0 ? 'val--down' : ''}">
                ${formatCurrency(result.adjustedTotal, symbol)}
              </div>
            </div>
          </div>

          <!-- Delta badge -->
          <div class="scenario-delta ${result.delta > 0 ? 'scenario-delta--up' : result.delta < 0 ? 'scenario-delta--down' : ''}">
            <span>${result.delta > 0 ? '▲' : result.delta < 0 ? '▼' : '—'}</span>
            <span>${result.delta > 0 ? '+' : ''}${formatCurrency(result.delta, symbol)}/month</span>
            <span>(${result.deltaPercent >= 0 ? '+' : ''}${result.deltaPercent.toFixed(1)}%)</span>
          </div>

          <!-- Annual impact -->
          <div class="scenario-annual">
            Annual impact: <strong ${result.delta !== 0 ? `style="color:${result.delta > 0 ? 'var(--color-danger)' : 'var(--color-success)'}"` : ''}>
              ${result.delta > 0 ? '+' : ''}${formatCurrency(result.delta * 12, symbol)}
            </strong>
          </div>

          <!-- Stacked bar comparison -->
          <div class="scenario-bar-wrap">
            <div class="scenario-bar-label">Baseline</div>
            <div class="scenario-bar" role="img" aria-label="Baseline cost distribution">
              ${GROUPS.map(g => {
                const pct = result.baselineTotal > 0 ? (result.baseline[g] / result.baselineTotal * 100) : 0
                if (pct === 0) return ''
                return `<div class="scenario-bar-seg" style="width:${pct.toFixed(1)}%;background:${CHART_COLORS[g]}"
                             title="${GROUP_LABELS[g]}: ${formatCurrency(result.baseline[g], symbol)} (${pct.toFixed(1)}%)"></div>`
              }).join('')}
            </div>
            <div class="scenario-bar-label">Projected</div>
            <div class="scenario-bar" role="img" aria-label="Projected cost distribution">
              ${GROUPS.map(g => {
                const pct = result.adjustedTotal > 0 ? (result.adjusted[g] / result.adjustedTotal * 100) : 0
                if (pct === 0) return ''
                return `<div class="scenario-bar-seg" style="width:${pct.toFixed(1)}%;background:${CHART_COLORS[g]}"
                             title="${GROUP_LABELS[g]}: ${formatCurrency(result.adjusted[g], symbol)} (${pct.toFixed(1)}%)"></div>`
              }).join('')}
            </div>
          </div>

          <!-- Save / Load -->
          <div class="scenario-actions">
            <button class="btn btn-primary btn-sm" id="scenario-save-btn">
              💾 Save Scenario
            </button>
            ${scenarios.length > 0 ? `
              <select id="scenario-load-select" class="scenario-load-select" aria-label="Load saved scenario">
                <option value="">📂 Load (${scenarios.length} saved)…</option>
                ${scenarios.map(s => `
                  <option value="${esc(s.id)}">${esc(s.name)} · ${esc(s.date)}</option>
                `).join('')}
              </select>
              <button class="btn btn-ghost btn-sm btn-icon scenario-delete-btn" id="scenario-delete-btn"
                      title="Delete selected scenario" style="color:var(--color-danger)">✕</button>
            ` : ''}
          </div>
        </div>
      </div>
    `

    // ── Slider events ───────────────────────────────────────────────────────
    container.querySelectorAll('.scenario-range').forEach(slider => {
      slider.addEventListener('input', () => {
        adjustments[slider.dataset.group] = parseInt(slider.value) / 100
        render()
      })
    })

    // ── Reset ───────────────────────────────────────────────────────────────
    container.querySelector('#scenario-reset-btn')?.addEventListener('click', () => {
      GROUPS.forEach(g => adjustments[g] = 0)
      render()
    })

    // ── Save ────────────────────────────────────────────────────────────────
    container.querySelector('#scenario-save-btn')?.addEventListener('click', () => {
      const currentScenarios = Store.getConfig()?.scenarios || []
      const defaultName = `Scenario ${currentScenarios.length + 1}`
      const name = window.prompt('Name this scenario:', defaultName)
      if (!name?.trim()) return

      const scenario = {
        id:          generateId('sc'),
        name:        name.trim(),
        date:        new Date().toISOString().slice(0, 10),
        adjustments: { ...adjustments },
      }

      const cfg = Store.getConfig()
      if (!cfg.scenarios) cfg.scenarios = []
      cfg.scenarios.push(scenario)
      Store.setConfig(cfg)

      config.scenarios = cfg.scenarios   // Sync local ref
      showToast(`Scenario "${name.trim()}" saved!`, 'success')
      render()
    })

    // ── Load ────────────────────────────────────────────────────────────────
    container.querySelector('#scenario-load-select')?.addEventListener('change', function () {
      const id = this.value
      if (!id) return
      const scenario = (config.scenarios || []).find(s => s.id === id)
      if (!scenario) return
      GROUPS.forEach(g => adjustments[g] = scenario.adjustments?.[g] || 0)
      render()
      showToast(`Loaded: ${scenario.name}`, 'info')
    })

    // ── Delete selected ─────────────────────────────────────────────────────
    container.querySelector('#scenario-delete-btn')?.addEventListener('click', () => {
      const select = container.querySelector('#scenario-load-select')
      const id = select?.value
      if (!id) {
        showToast('Select a scenario to delete.', 'info')
        return
      }
      const scenario = (config.scenarios || []).find(s => s.id === id)
      if (!scenario) return
      if (!window.confirm(`Delete scenario "${scenario.name}"?`)) return

      const cfg = Store.getConfig()
      cfg.scenarios = (cfg.scenarios || []).filter(s => s.id !== id)
      Store.setConfig(cfg)
      config.scenarios = cfg.scenarios
      showToast(`Deleted: ${scenario.name}`, 'success')
      render()
    })
  }

  render()
}
