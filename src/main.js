import './styles/variables.css'
import './styles/base.css'
import './styles/wizard.css'
import './styles/dashboard.css'

import { Router } from './core/router.js'
import { EventBus } from './core/events.js'
import { renderWizard } from './wizard/Wizard.js'
import { renderDashboard } from './dashboard/Dashboard.js'
import { applyChartDefaults, destroyAllCharts } from './dashboard/components/ChartHelpers.js'

const app = document.getElementById('app')

function renderPage(route) {
  // Fade-out
  app.classList.add('page-exit')

  setTimeout(() => {
    destroyAllCharts()  // Clean up Chart.js instances before clearing DOM
    app.innerHTML = ''
    app.classList.remove('page-exit')
    app.classList.add('page-enter')

    switch (route) {
      case 'wizard':    renderWizard(app);    break
      case 'dashboard': renderDashboard(app); break
      default:          renderWizard(app)
    }

    requestAnimationFrame(() => {
      app.classList.remove('page-enter')
      app.classList.add('page-enter-active')
    })
    setTimeout(() => app.classList.remove('page-enter-active'), 350)
  }, 200)
}

// Initialize Chart defaults once
applyChartDefaults()

// Subscribe to route changes
Router.onRouteChange(renderPage)

// Start the app
Router.init()
