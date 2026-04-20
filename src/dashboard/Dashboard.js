import { Store }                  from '../core/store.js'
import { Router }                  from '../core/router.js'
import { EventBus }                from '../core/events.js'
import { showToast, downloadJSON, escapeHtml as esc } from '../core/utils.js'
import { destroyAllCharts }        from './components/ChartHelpers.js'
import { renderKpiCards }          from './widgets/KpiCards.js'
import { renderCostBreakdown }     from './widgets/CostBreakdownChart.js'
import { renderCostTrend }         from './widgets/CostTrendChart.js'
import { renderRouteCosts }        from './widgets/RouteCostChart.js'
import { renderSupplyChainMap }     from './widgets/SupplyChainMap.js'
import { renderScenarioWidget }    from './widgets/ScenarioWidget.js'

// Module-level listener ref — survives across renderDashboard() calls
let _configChangedHandler = null

export function renderDashboard(container) {
  const config = Store.getConfig()
  if (!config) {
    Router.navigate('wizard')
    return
  }

  const pref   = config.preferences || {}
  const symbol = pref.currencySymbol || '$'
  const title  = pref.dashboardTitle || 'Logistics Cost Dashboard'
  const logo   = pref.logo

  // ─── Build shell ─────────────────────────────────────────────────────────
  container.innerHTML = `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="dashboard-header-left">
          ${logo
            ? `<img src="${logo}" class="dashboard-logo" alt="Company logo">`
            : `<div class="dashboard-logo-placeholder" aria-hidden="true">📊</div>`
          }
          <div>
            <div class="dashboard-title" id="dashboard-title">${esc(title)}</div>
            <div class="dashboard-subtitle">${esc(config.company?.name || '')}${config.company?.industry ? ' · ' + esc(config.company.industry) : ''}</div>
          </div>
        </div>

        <div class="dashboard-actions">
          <button class="btn btn-ghost btn-sm" id="btn-import" title="Import configuration">
            📥 <span class="btn-label">Import</span>
          </button>
          <button class="btn btn-ghost btn-sm" id="btn-export" title="Export configuration">
            📤 <span class="btn-label">Export</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-settings" title="Edit configuration">
            ⚙️ <span class="btn-label">Settings</span>
          </button>
          <button class="btn btn-danger btn-sm" id="btn-reset" title="Reset all data">
            🗑️
          </button>
        </div>
      </header>

      <!-- Hidden file input for import -->
      <input type="file" id="import-file-input" accept=".json" style="display:none" aria-label="Import JSON configuration file">

      <!-- Body -->
      <main class="dashboard-body">
        <!-- KPI Row -->
        <div id="kpi-container"></div>

        <!-- Widget Grid -->
        <div class="widget-grid">
          <!-- Widget 1: Cost Breakdown -->
          <div class="widget" id="breakdown-widget">
            <div class="widget-header">
              <div class="widget-title-group">
                <span class="widget-icon">🍩</span>
                <div>
                  <div class="widget-title">Cost Breakdown</div>
                  <div class="widget-subtitle">Monthly distribution by category group</div>
                </div>
              </div>
            </div>
            <div class="widget-body" id="breakdown-body"></div>
          </div>

          <!-- Widget 2: Monthly Trend -->
          <div class="widget" id="trend-widget">
            <div class="widget-header">
              <div class="widget-title-group">
                <span class="widget-icon">📈</span>
                <div>
                  <div class="widget-title">Monthly Cost Trend</div>
                  <div class="widget-subtitle">12-month projected view</div>
                </div>
              </div>
            </div>
            <div class="widget-body" id="trend-body"></div>
          </div>

          <!-- Widget 3: Route Costs -->
          <div class="widget" id="route-widget">
            <div class="widget-header">
              <div class="widget-title-group">
                <span class="widget-icon">🚚</span>
                <div>
                  <div class="widget-title">Route Cost Comparison</div>
                  <div class="widget-subtitle">Monthly cost per route (sorted highest)</div>
                </div>
              </div>
            </div>
            <div class="widget-body" id="route-body"></div>
          </div>

          <!-- Widget 4: Supply Chain Map -->
          <div class="widget" id="map-widget">
            <div class="widget-header">
              <div class="widget-title-group">
                <span class="widget-icon">🗺️</span>
                <div>
                  <div class="widget-title">Supply Chain Map</div>
                  <div class="widget-subtitle">Interactive network visualization</div>
                </div>
              </div>
            </div>
            <div class="widget-body" id="map-body"></div>
          </div>
        </div>

        <!-- Widget 5: Scenario Analysis (full-width) -->
        <div class="widget scenario-widget" id="scenario-widget">
          <div class="widget-header">
            <div class="widget-title-group">
              <span class="widget-icon">📊</span>
              <div>
                <div class="widget-title">Scenario Analysis</div>
                <div class="widget-subtitle">Adjust cost groups to model "what-if" scenarios</div>
              </div>
            </div>
          </div>
          <div class="widget-body" id="scenario-body"></div>
        </div>
      </main>
    </div>
  `

  // ─── Render all widgets ────────────────────────────────────────────────────
  const renderAllWidgets = (cfg) => {
    renderKpiCards(container.querySelector('#kpi-container'), cfg)
    renderCostBreakdown(container.querySelector('#breakdown-body'), cfg)
    renderCostTrend(container.querySelector('#trend-body'), cfg)
    renderRouteCosts(container.querySelector('#route-body'), cfg)
    renderSupplyChainMap(container.querySelector('#map-body'), cfg)
    renderScenarioWidget(container.querySelector('#scenario-body'), cfg)
  }

  renderAllWidgets(config)

  // ─── Subscribe to config changes (e.g. after import) ───────────────────────
  // Remove previous listener (if any) to prevent ghost renders on re-navigation
  if (_configChangedHandler) {
    EventBus.off('config-changed', _configChangedHandler)
  }
  _configChangedHandler = (newConfig) => {
    // Guard: skip if dashboard is no longer in the DOM (user navigated to wizard)
    if (!document.contains(container)) return
    destroyAllCharts()
    renderAllWidgets(newConfig)
  }
  EventBus.on('config-changed', _configChangedHandler)

  // ─── Header button handlers ───────────────────────────────────────────────
  container.querySelector('#btn-settings').addEventListener('click', () => {
    Router.navigate('wizard')
  })

  container.querySelector('#btn-export').addEventListener('click', () => {
    const json = Store.exportConfig()
    if (!json) { showToast('No configuration to export.', 'error'); return }
    const cfg = Store.getConfig()
    const companySlug = (cfg.company?.name || 'dashboard').replace(/\s+/g, '-').toLowerCase()
    const date = new Date().toISOString().slice(0, 10)
    downloadJSON(json, `logistics-dashboard-${companySlug}-${date}.json`)
    showToast('Configuration exported successfully!', 'success')
  })

  container.querySelector('#btn-import').addEventListener('click', () => {
    container.querySelector('#import-file-input').click()
  })

  container.querySelector('#import-file-input').addEventListener('change', function() {
    const file = this.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large (max 5MB).', 'error'); return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = Store.importConfig(e.target.result)
      if (result.success) {
        showToast('Configuration imported successfully!', 'success')
        // Re-render dashboard with new config
        renderDashboard(container)
      } else {
        showToast(`Import failed: ${result.errors[0]}`, 'error')
      }
    }
    reader.readAsText(file)
    this.value = '' // Reset so same file can be imported again
  })

  container.querySelector('#btn-reset').addEventListener('click', () => {
    if (confirm('Reset all data? This cannot be undone.')) {
      Store.resetConfig()
      Router.navigate('wizard')
    }
  })
}

