import { formatCurrency, formatPercent, formatNumber, escapeHtml as esc } from '../../core/utils.js'
import { calcTotalMonthlyCost, calcCostByGroup, calcRouteCosts } from '../../data/calculator.js'

const STEP_INDEX = { company: 1, products: 2, supplychain: 3, costs: 4, preferences: 5 }

export const ReviewStep = {
  render(container, data, _onUpdate, onAction) {
    const { company = {}, products = [], nodes = [], routes = [], costCategories = [], preferences = {} } = data
    const symbol = data.symbol || preferences.currencySymbol || '$'

    const monthlyTotal = calcTotalMonthlyCost({ costCategories })
    const byGroup = calcCostByGroup({ costCategories })
    const topCosts = [...costCategories]
      .filter(c => c.enabled && c.monthlyCost > 0)
      .sort((a, b) => b.monthlyCost - a.monthlyCost)
      .slice(0, 3)

    const factories  = nodes.filter(n => n.type === 'factory').length
    const warehouses = nodes.filter(n => n.type === 'warehouse' || n.type === 'dc').length
    const customers  = nodes.filter(n => n.type === 'customer').length
    const enabledCats = costCategories.filter(c => c.enabled).length

    container.innerHTML = `
      <div class="step-heading">
        <h2>✅ Review & Launch</h2>
        <p>Everything looks good? Review your setup below and launch the dashboard.
           Changes will be saved when you launch.</p>
      </div>

      <div class="review-sections">

        <!-- Company -->
        <div class="review-section">
          <div class="review-section-header">
            <div class="review-section-title">🏢 Company</div>
            <button class="btn btn-ghost btn-sm review-edit-btn" data-step="1">Edit</button>
          </div>
          <div class="review-stats">
            <div class="review-stat">
              <span class="review-stat-value">${esc(company.name || '—')}</span>
              <span class="review-stat-label">Company Name</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${esc(company.industry || '—')}</span>
              <span class="review-stat-label">Industry</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${esc(company.country || '—')}</span>
              <span class="review-stat-label">Country</span>
            </div>
            ${company.annualRevenue ? `
              <div class="review-stat">
                <span class="review-stat-value">${formatCurrency(company.annualRevenue, symbol)}</span>
                <span class="review-stat-label">Annual Revenue</span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Products -->
        <div class="review-section">
          <div class="review-section-header">
            <div class="review-section-title">📦 Products</div>
            <button class="btn btn-ghost btn-sm review-edit-btn" data-step="2">Edit</button>
          </div>
          <div class="review-stats">
            <div class="review-stat">
              <span class="review-stat-value">${products.length}</span>
              <span class="review-stat-label">Products configured</span>
            </div>
          </div>
          ${products.length > 0 ? `
            <p class="text-sm text-secondary" style="margin-top:var(--space-2)">
              ${products.map(p => esc(p.name)).filter(Boolean).slice(0, 4).join(', ')}${products.length > 4 ? ` and ${products.length - 4} more…` : ''}
            </p>
          ` : ''}
        </div>

        <!-- Supply Chain -->
        <div class="review-section">
          <div class="review-section-header">
            <div class="review-section-title">🔗 Supply Chain</div>
            <button class="btn btn-ghost btn-sm review-edit-btn" data-step="3">Edit</button>
          </div>
          <div class="review-stats">
            <div class="review-stat">
              <span class="review-stat-value">${nodes.length}</span>
              <span class="review-stat-label">Total locations</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${factories}</span>
              <span class="review-stat-label">Factories</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${warehouses}</span>
              <span class="review-stat-label">Warehouses</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${customers}</span>
              <span class="review-stat-label">Customer points</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${routes.length}</span>
              <span class="review-stat-label">Routes</span>
            </div>
          </div>
        </div>

        <!-- Costs -->
        <div class="review-section">
          <div class="review-section-header">
            <div class="review-section-title">💰 Cost Structure</div>
            <button class="btn btn-ghost btn-sm review-edit-btn" data-step="4">Edit</button>
          </div>
          <div class="review-stats">
            <div class="review-stat">
              <span class="review-stat-value">${formatCurrency(monthlyTotal, symbol)}</span>
              <span class="review-stat-label">Est. Monthly Cost</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${formatCurrency(monthlyTotal * 12, symbol)}</span>
              <span class="review-stat-label">Est. Annual Cost</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${enabledCats}</span>
              <span class="review-stat-label">Active categories</span>
            </div>
          </div>
          ${topCosts.length > 0 ? `
            <p class="text-sm text-secondary" style="margin-top:var(--space-2)">
              Top costs: ${topCosts.map(c => `${c.name} (${formatCurrency(c.monthlyCost, symbol)})`).join(' · ')}
            </p>
          ` : ''}
        </div>

        <!-- Preferences -->
        <div class="review-section">
          <div class="review-section-header">
            <div class="review-section-title">⚙️ Preferences</div>
            <button class="btn btn-ghost btn-sm review-edit-btn" data-step="5">Edit</button>
          </div>
          <div class="review-stats">
            <div class="review-stat">
              <span class="review-stat-value">${esc(preferences.dashboardTitle || 'Dashboard')}</span>
              <span class="review-stat-label">Dashboard Title</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${preferences.currency || 'USD'} ${preferences.currencySymbol || '$'}</span>
              <span class="review-stat-label">Currency</span>
            </div>
            <div class="review-stat">
              <span class="review-stat-value">${preferences.weightUnit || 'ton'} · ${preferences.distanceUnit || 'km'}</span>
              <span class="review-stat-label">Units</span>
            </div>
          </div>
        </div>
      </div>

      <div class="wizard-launch">
        <button class="btn btn-primary btn-xl" id="launch-btn">
          🚀 Launch Dashboard
        </button>
        <p class="text-xs text-muted">All data is saved locally in your browser — no server required.</p>
      </div>
    `

    container.querySelectorAll('.review-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step)
        onAction('goto', step)
      })
    })

    container.querySelector('#launch-btn').addEventListener('click', () => {
      onAction('launch')
    })
  },

  validate() { return { valid: true, errors: [] } }
}

