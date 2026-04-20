import { EventBus } from './events.js'
import { showToast } from './utils.js'

const STORAGE_KEY = 'logistics-dashboard-config'

export const Store = {
  hasConfig() {
    try {
      return !!localStorage.getItem(STORAGE_KEY)
    } catch {
      return false
    }
  },

  getConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('Store.getConfig error:', e)
      return null
    }
  },

  setConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      EventBus.emit('config-changed', config)
      return true
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        showToast('Storage is full. Try removing logo or reducing data.', 'error')
        return false
      }
      throw err
    }
  },

  resetConfig() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Store.resetConfig error:', e)
    }
  },

  exportConfig() {
    const config = this.getConfig()
    if (!config) return null
    return JSON.stringify(config, null, 2)
  },

  importConfig(jsonString) {
    try {
      const parsed = JSON.parse(jsonString)
      const { valid, errors } = validateImportedConfig(parsed)
      if (!valid) {
        return { success: false, errors }
      }
      // Fill missing optional sections with defaults
      if (!parsed.costData) parsed.costData = { monthly: [] }
      this.setConfig(parsed)
      return { success: true }
    } catch (e) {
      return { success: false, errors: ['Invalid JSON file.'] }
    }
  }
}

function validateImportedConfig(config) {
  const errors = []
  const requiredKeys = ['company', 'products', 'nodes', 'routes', 'costCategories', 'preferences']

  for (const key of requiredKeys) {
    if (!(key in config)) errors.push(`Missing required section: "${key}"`)
  }

  if (config.products && !Array.isArray(config.products)) errors.push('Products must be an array')
  if (config.nodes && !Array.isArray(config.nodes)) errors.push('Nodes must be an array')
  if (config.routes && !Array.isArray(config.routes)) errors.push('Routes must be an array')
  if (config.costCategories && !Array.isArray(config.costCategories)) errors.push('Cost categories must be an array')

  // Logo must be a safe data URI (prevent XSS via crafted src attribute)
  if (config.preferences?.logo && typeof config.preferences.logo === 'string') {
    if (!config.preferences.logo.startsWith('data:image/')) {
      errors.push('Logo must be a data:image URI')
    }
  }

  // Referential integrity: routes must reference existing nodes
  if (config.routes && config.nodes) {
    const nodeIds = new Set(config.nodes.map(n => n.id))
    for (const route of config.routes) {
      if (!nodeIds.has(route.fromId)) errors.push(`Route references unknown origin node`)
      if (!nodeIds.has(route.toId)) errors.push(`Route references unknown destination node`)
    }
  }

  return { valid: errors.length === 0, errors }
}
