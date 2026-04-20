/**
 * Shared form helper utilities for wizard steps.
 */

export function showValidationBanner(containerId, errors) {
  const el = document.getElementById(containerId)
  if (!el) return
  el.innerHTML = `
    <div class="validation-banner" role="alert" aria-live="assertive">
      <div>
        <strong>⚠️ Please fix the following:</strong>
        <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
      </div>
    </div>
  `
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

export function clearValidationBanner(containerId) {
  const el = document.getElementById(containerId)
  if (el) el.innerHTML = ''
}

export function markFieldError(fieldGroupId, show = true) {
  const el = document.getElementById(fieldGroupId)
  if (el) el.classList.toggle('has-error', show)
}

export function clearFieldErrors(container) {
  container.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'))
}
