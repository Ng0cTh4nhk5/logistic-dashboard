import { renderProgressBar } from './components/ProgressBar.js'
// FormHelpers used by individual steps, not the wizard shell
import { WelcomeStep }     from './steps/WelcomeStep.js'
import { CompanyStep }     from './steps/CompanyStep.js'
import { ProductStep }     from './steps/ProductStep.js'
import { SupplyChainStep } from './steps/SupplyChainStep.js'
import { CostStep }        from './steps/CostStep.js'
import { PreferencesStep } from './steps/PreferencesStep.js'
import { ReviewStep }      from './steps/ReviewStep.js'
import { Store }           from '../core/store.js'
import { Router }          from '../core/router.js'
import { DEFAULT_CONFIG, DEFAULT_COST_CATEGORIES } from '../data/defaults.js'
import { deepClone }       from '../core/utils.js'

const STEPS = [
  { label: 'Welcome',      icon: '👋', module: WelcomeStep },
  { label: 'Company',      icon: '🏢', module: CompanyStep },
  { label: 'Products',     icon: '📦', module: ProductStep },
  { label: 'Supply Chain', icon: '🔗', module: SupplyChainStep },
  { label: 'Costs',        icon: '💰', module: CostStep },
  { label: 'Preferences',  icon: '⚙️',  module: PreferencesStep },
  { label: 'Review',       icon: '✅', module: ReviewStep },
]

export function renderWizard(container) {
  // ─── Edit mode detection ──────────────────────────────────────────────────
  const existingConfig = Store.getConfig()
  const isEditMode = !!existingConfig

  // In-memory wizard state
  let currentStep = 0
  let direction = 'forward' // 'forward' | 'back'
  let wizardData

  if (isEditMode) {
    // Load existing config — only the fields wizard manages
    const cfg = deepClone(existingConfig)
    wizardData = {
      company:        cfg.company        || {},
      products:       cfg.products       || [],
      nodes:          cfg.nodes          || [],
      routes:         cfg.routes         || [],
      costCategories: cfg.costCategories || deepClone(DEFAULT_COST_CATEGORIES),
      preferences:    cfg.preferences    || {
        currency: 'USD', currencySymbol: '$', weightUnit: 'ton',
        distanceUnit: 'km', language: 'en', logo: null,
        dashboardTitle: 'Logistics Cost Dashboard',
      }
    }
    // ⚠️ Intentionally NOT copying costData/scenarios to avoid stale derived data
  } else {
    wizardData = {
      company:       {},
      products:      [],
      nodes:         [],
      routes:        [],
      costCategories: deepClone(DEFAULT_COST_CATEGORIES),
      preferences: {
        currency: 'USD', currencySymbol: '$', weightUnit: 'ton',
        distanceUnit: 'km', language: 'en', logo: null,
        dashboardTitle: 'Logistics Cost Dashboard',
      }
    }
  }

  // ─── Scaffold ────────────────────────────────────────────────────────────
  container.innerHTML = `
    <div class="wizard-container">
      <div class="wizard-inner">
        <div class="wizard-header">
          <div class="wizard-logo">
            <span>📊</span>
            <span class="wizard-brand">Logistics Dashboard Setup</span>
          </div>
        </div>
        <div id="wizard-progress"></div>
        <div id="wizard-validation-slot"></div>
        <div id="wizard-content" class="wizard-content"></div>
        <div id="wizard-nav" class="wizard-nav"></div>
      </div>
    </div>
  `

  const progressEl  = container.querySelector('#wizard-progress')
  const contentEl   = container.querySelector('#wizard-content')
  const navEl       = container.querySelector('#wizard-nav')

  // ─── Render a step ────────────────────────────────────────────────────────
  const renderStep = (step, dir = 'forward') => {
    // Progress bar (hide on welcome)
    if (step === 0) {
      progressEl.innerHTML = ''
    } else {
      renderProgressBar(progressEl, step - 1, STEPS.slice(1), { allCompleted: isEditMode })

      // Clickable progress steps in edit mode
      if (isEditMode) {
        progressEl.querySelectorAll('.wizard-progress-step').forEach((el, i) => {
          const targetStep = i + 1 // offset: progress bar skips Welcome (step 0)
          el.style.cursor = 'pointer'
          el.title = `Go to ${STEPS[targetStep].label}`
          el.addEventListener('click', () => {
            direction = targetStep < currentStep ? 'back' : 'forward'
            currentStep = targetStep
            renderStep(currentStep, direction)
          })
        })
      }
    }

    // Animate content
    const stepWrap = document.createElement('div')
    stepWrap.className = `wizard-step ${dir === 'back' ? 'slide-enter-back' : 'slide-enter'}`
    contentEl.innerHTML = ''
    contentEl.appendChild(stepWrap)

    requestAnimationFrame(() => {
      stepWrap.classList.add(dir === 'back' ? 'slide-enter-back-active' : 'slide-enter-active')
    })

    // Render step content
    const stepModule = STEPS[step].module
    const stepData = getStepData(step)

    // 4th arg: CostStep expects currency symbol, Welcome/Review expect onAction handler
    const stepExtra = step === 4
      ? (wizardData.preferences?.currencySymbol || '$')
      : handleStepAction
    stepModule.render(stepWrap, stepData, (newData) => {
      setStepData(step, newData)
    }, stepExtra)

    // Navigation buttons
    renderNav(step)

    // Focus first interactive element
    setTimeout(() => {
      const first = stepWrap.querySelector('input:not([type="hidden"]), select, button, [tabindex]')
      first?.focus()
    }, 270)
  }

  // ─── Map step index to wizardData section ────────────────────────────────
  const getStepData = (step) => {
    switch (step) {
      case 1: return wizardData.company
      case 2: return wizardData.products
      case 3: return { nodes: wizardData.nodes, routes: wizardData.routes, symbol: wizardData.preferences.currencySymbol || '$' }
      case 4: return wizardData.costCategories
      case 5: return wizardData.preferences
      case 6: return { ...wizardData, symbol: wizardData.preferences.currencySymbol || '$' }  // Review gets everything
      default: return {}
    }
  }

  const setStepData = (step, newData) => {
    switch (step) {
      case 1: wizardData.company = newData; break
      case 2: wizardData.products = newData; break
      case 3:
        wizardData.nodes  = newData.nodes || []
        wizardData.routes = newData.routes || []
        break
      case 4: wizardData.costCategories = newData; break
      case 5: wizardData.preferences = newData; break
    }
  }

  // ─── Navigation ───────────────────────────────────────────────────────────
  const renderNav = (step) => {
    if (step === 0) { navEl.innerHTML = ''; return }

    const isLast = step === STEPS.length - 1
    const isFirst = step === 1
    const showCancel = isFirst && isEditMode

    navEl.innerHTML = `
      ${showCancel
        ? `<button class="btn btn-ghost" id="wizard-cancel-btn">✕ Cancel</button>`
        : `<button class="btn btn-ghost" id="wizard-back-btn" ${isFirst ? 'disabled' : ''}>← Back</button>`
      }
      <div class="wizard-nav-right">
        <span style="font-size:var(--font-size-xs);color:var(--color-text-muted);align-self:center">
          Step ${step} of ${STEPS.length - 1}
        </span>
        ${isLast
          ? '' // Review step handles its own launch button
          : `<button class="btn btn-primary" id="wizard-next-btn">
              Next →
            </button>`
        }
      </div>
    `

    navEl.querySelector('#wizard-cancel-btn')?.addEventListener('click', () => {
      document.removeEventListener('keydown', handleEnter)
      Router.navigate('dashboard')
    })
    navEl.querySelector('#wizard-back-btn')?.addEventListener('click', () => {
      direction = 'back'
      currentStep--
      renderStep(currentStep, 'back')
    })
    navEl.querySelector('#wizard-next-btn')?.addEventListener('click', () => goNext())

    // Also allow Enter key to advance (remove first to prevent duplicates)
    document.removeEventListener('keydown', handleEnter)
    document.addEventListener('keydown', handleEnter)
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
      const nextBtn = document.getElementById('wizard-next-btn')
      if (nextBtn && document.contains(nextBtn)) nextBtn.click()
    }
    if (e.key === 'Escape') {
      const cancelBtn = document.getElementById('wizard-cancel-btn')
      if (cancelBtn && document.contains(cancelBtn)) { cancelBtn.click(); return }
      const backBtn = document.getElementById('wizard-back-btn')
      if (backBtn && !backBtn.disabled && document.contains(backBtn)) backBtn.click()
    }
  }

  const goNext = () => {
    const stepModule = STEPS[currentStep].module
    const result = stepModule.validate(getStepData(currentStep))

    if (!result.valid) {
      // Show validation banner inside the step
      const banContainer = contentEl.querySelector('[id$="-validation"]')
      if (banContainer) {
        banContainer.innerHTML = `
          <div class="validation-banner" role="alert" aria-live="assertive">
            <div>
              <strong>⚠️ Please fix the following:</strong>
              <ul>${result.errors.map(e => `<li>${e}</li>`).join('')}</ul>
            </div>
          </div>
        `
        banContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
      return
    }

    currentStep++
    renderStep(currentStep, 'forward')
  }

  // ─── Special step actions ──────────────────────────────────────────────────
  const handleStepAction = (action, payload) => {
    if (action === 'fresh') {
      currentStep = 1
      renderStep(currentStep, 'forward')
    } else if (action === 'demo') {
      document.removeEventListener('keydown', handleEnter)
      Store.setConfig(deepClone(DEFAULT_CONFIG))
      Router.navigate('dashboard')
    } else if (action === 'launch') {
      // Assemble and save
      document.removeEventListener('keydown', handleEnter)
      Store.setConfig({ ...wizardData, costData: { monthly: [] } })
      Router.navigate('dashboard')
    } else if (action === 'goto') {
      // Jump to specific step (from Review edit buttons)
      const targetStep = parseInt(payload)
      direction = targetStep < currentStep ? 'back' : 'forward'
      currentStep = targetStep
      renderStep(currentStep, direction)
    }
  }

  // ─── Start ────────────────────────────────────────────────────────────────
  if (isEditMode) {
    currentStep = 1  // Skip Welcome — go straight to Company
    renderStep(currentStep, 'forward')
  } else {
    renderStep(0, 'forward')
  }
}
