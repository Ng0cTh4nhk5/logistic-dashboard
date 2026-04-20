/**
 * Renders the step progress bar.
 * @param {HTMLElement} container
 * @param {number} currentStep  0-based
 * @param {Array}  steps        [{label, icon}]
 */
export function renderProgressBar(container, currentStep, steps, { allCompleted = false } = {}) {
  container.innerHTML = ''

  const nav = document.createElement('nav')
  nav.className = 'wizard-progress'
  nav.setAttribute('aria-label', 'Setup wizard progress')

  steps.forEach((step, i) => {
    // Step circle + label
    const stepEl = document.createElement('div')
    const state = i === currentStep
      ? 'active'
      : (i < currentStep || allCompleted) ? 'completed' : 'upcoming'
    stepEl.className = `wizard-progress-step ${state}`

    const ariaLabel = state === 'completed'
      ? `Step ${i + 1} completed: ${step.label}`
      : `Step ${i + 1}: ${step.label}`

    stepEl.innerHTML = `
      <div class="wizard-progress-circle"
           aria-label="${ariaLabel}"
           ${i === currentStep ? 'aria-current="step"' : ''}>
        ${state === 'completed' ? '✓' : i + 1}
      </div>
      <div class="wizard-progress-label">${step.label}</div>
    `
    nav.appendChild(stepEl)

    // Connecting line (not after last step)
    if (i < steps.length - 1) {
      const line = document.createElement('div')
      line.className = `wizard-progress-line ${(i < currentStep || allCompleted) ? 'completed' : ''}`
      nav.appendChild(line)
    }
  })

  container.appendChild(nav)
}
