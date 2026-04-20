// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatCurrency(amount, symbol = '$') {
  if (amount === null || amount === undefined || isNaN(amount)) return `${symbol}0`
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(amount))
  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`
}

export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

// ─── ID generation ────────────────────────────────────────────────────────────

export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substring(2, 8)}`
}

// ─── Number sanitization ──────────────────────────────────────────────────────

export function sanitizeNumber(value, { min = 0, max = 999999999999, integer = false, fallback = 0 } = {}) {
  let num = parseFloat(String(value).replace(/[^0-9.-]/g, ''))
  if (isNaN(num)) return fallback
  if (integer) num = Math.round(num)
  return Math.max(min, Math.min(max, num))
}

// ─── Number input formatting (thousands separator) ────────────────────────────

/**
 * Format a number/string with thousand separators (private helper).
 */
function _formatWithCommas(value, allowDecimal = false) {
  const str = String(value)
  if (allowDecimal && str.includes('.')) {
    const [intPart, decPart] = str.split('.')
    return `${Number(intPart).toLocaleString('en-US')}.${decPart}`
  }
  const n = parseFloat(str.replace(/,/g, ''))
  if (isNaN(n)) return ''
  return n.toLocaleString('en-US')
}

/**
 * Attach auto-format behavior to a text input.
 * Converts raw digits to "1,234,567" display while typing.
 * Raw numeric value stored in data-raw-value attribute.
 *
 * @param {HTMLInputElement} input - should be type="text" inputmode="numeric"
 * @param {object} opts
 * @param {boolean} opts.allowDecimal - allow decimal point (default: false)
 * @param {function} opts.onInput - callback(rawNumber) when value changes
 */
export function formatNumberInput(input, { allowDecimal = false, onInput } = {}) {
  if (!input) return

  // Format initial value from data-raw-value or current value
  const initRaw = input.dataset.rawValue || input.value.replace(/,/g, '')
  const initNum = parseFloat(initRaw)
  if (!isNaN(initNum) && initNum > 0) {
    input.dataset.rawValue = String(initNum)
    input.value = _formatWithCommas(initNum, allowDecimal)
  }

  input.addEventListener('input', () => {
    const cursorPos = input.selectionStart
    const prevLen = input.value.length

    // Strip everything except digits (and optionally dot)
    const pattern = allowDecimal ? /[^0-9.]/g : /[^0-9]/g
    let raw = input.value.replace(pattern, '')

    // Only one decimal point allowed
    if (allowDecimal) {
      const parts = raw.split('.')
      raw = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '')
    }

    input.dataset.rawValue = raw

    // Format display
    if (raw === '' || raw === '.') {
      input.value = raw
    } else {
      input.value = _formatWithCommas(raw, allowDecimal)
    }

    // Restore cursor (adjust for added/removed commas)
    const diff = input.value.length - prevLen
    const newCursor = Math.max(0, cursorPos + diff)
    input.setSelectionRange(newCursor, newCursor)

    if (onInput) onInput(parseFloat(raw) || 0)
  })

  // Select all on focus for easy overwrite
  input.addEventListener('focus', () => {
    setTimeout(() => input.select(), 0)
  })
}

/**
 * Read the raw numeric value from a formatted input.
 * @param {HTMLInputElement} input
 * @returns {number}
 */
export function getRawNumber(input) {
  if (!input) return 0
  const raw = input.dataset.rawValue !== undefined
    ? input.dataset.rawValue
    : input.value.replace(/,/g, '')
  return parseFloat(raw) || 0
}

/**
 * Set a numeric value on a formatted input (updates both display and raw).
 * @param {HTMLInputElement} input
 * @param {number} value
 * @param {boolean} allowDecimal
 */
export function setFormattedValue(input, value, allowDecimal = false) {
  if (!input) return
  const num = Number(value) || 0
  input.dataset.rawValue = String(num)
  input.value = num > 0 ? _formatWithCommas(num, allowDecimal) : ''
}

// ─── Object utilities ─────────────────────────────────────────────────────────

export function deepClone(obj) {
  if (typeof structuredClone === 'function') return structuredClone(obj)
  return JSON.parse(JSON.stringify(obj))
}

export function groupBy(array, key) {
  return array.reduce((acc, item) => {
    const group = typeof key === 'function' ? key(item) : item[key]
    ;(acc[group] ??= []).push(item)
    return acc
  }, {})
}

// ─── Function utilities ───────────────────────────────────────────────────────

export function debounce(fn, ms = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// ─── Toast notifications ──────────────────────────────────────────────────────

export function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast')
  if (existing) existing.remove()

  const icons = { success: '✅', error: '❌', info: 'ℹ️' }
  const toast = document.createElement('div')
  toast.className = `toast toast--${type}`
  toast.setAttribute('role', 'alert')

  const iconSpan = document.createElement('span')
  iconSpan.className = 'toast-icon'
  iconSpan.textContent = icons[type] || '•'

  const msgSpan = document.createElement('span')
  msgSpan.className = 'toast-message'
  msgSpan.textContent = message  // textContent — safe from XSS

  toast.appendChild(iconSpan)
  toast.appendChild(msgSpan)
  document.body.appendChild(toast)

  // Animate in
  requestAnimationFrame(() => toast.classList.add('toast--visible'))

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('toast--visible')
    toast.addEventListener('transitionend', () => toast.remove(), { once: true })
  }, 3500)
}

// ─── Image utilities ──────────────────────────────────────────────────────────

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function resizeImage(file, maxWidth = 200, maxHeight = 200) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src) // Free Object URL memory
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png', 0.85))
    }
    img.src = URL.createObjectURL(file)
  })
}

// ─── Export / download ────────────────────────────────────────────────────────

export function downloadJSON(json, filename) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── HTML escape ──────────────────────────────────────────────────────────────

export function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
