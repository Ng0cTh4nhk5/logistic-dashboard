import { DEFAULT_CONFIG } from '../../data/defaults.js'
import { Store } from '../../core/store.js'
import { Router } from '../../core/router.js'
import { deepClone } from '../../core/utils.js'

export const WelcomeStep = {
  render(container, _data, _onUpdate, onAction) {
    container.innerHTML = `
      <div class="wizard-welcome">
        <h1>Logistics Cost Dashboard</h1>
        <p class="subtitle">
          A fully customizable dashboard for analyzing and presenting your logistics cost structure.
          Set it up in minutes — no coding required.
        </p>

        <div class="wizard-welcome-cards">
          <div class="wizard-welcome-card" id="btn-start-fresh" tabindex="0" role="button"
               aria-label="Start fresh — configure from scratch">
            <span class="welcome-card-icon">🚀</span>
            <div class="welcome-card-title">Start Fresh</div>
            <div class="welcome-card-desc">Configure your own logistics data from scratch. Take about 5 minutes.</div>
          </div>

          <div class="wizard-welcome-card demo" id="btn-load-demo" tabindex="0" role="button"
               aria-label="Load demo data — pre-filled cooking oil scenario">
            <span class="welcome-card-icon">📦</span>
            <div class="welcome-card-title">Load Demo Data</div>
            <div class="welcome-card-desc">Pre-filled cooking oil logistics scenario (USA). Jump straight to the dashboard.</div>
          </div>
        </div>
      </div>
    `

    const setup = (el, action) => {
      const fire = () => onAction(action)
      el.addEventListener('click', fire)
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fire() })
    }

    setup(container.querySelector('#btn-start-fresh'), 'fresh')
    setup(container.querySelector('#btn-load-demo'), 'demo')
  },

  validate() { return { valid: true, errors: [] } }
}
