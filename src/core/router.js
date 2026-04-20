import { Store } from './store.js'
import { EventBus } from './events.js'

const VALID_ROUTES = ['wizard', 'dashboard']
const routeChangeCallbacks = []

export const Router = {
  init() {
    window.addEventListener('hashchange', handleChange)
    // Determine initial route
    const hash = window.location.hash.replace('#', '')
    if (VALID_ROUTES.includes(hash)) {
      fireCallbacks(hash)
    } else {
      // Auto-route based on saved config
      if (Store.hasConfig()) {
        this.navigate('dashboard')
      } else {
        this.navigate('wizard')
      }
    }
  },

  navigate(route) {
    if (!VALID_ROUTES.includes(route)) {
      console.warn(`Router: unknown route "${route}"`)
      return
    }
    window.location.hash = '#' + route
  },

  getCurrentRoute() {
    return window.location.hash.replace('#', '') || null
  },

  onRouteChange(callback) {
    routeChangeCallbacks.push(callback)
  }
}

function handleChange() {
  const route = window.location.hash.replace('#', '')
  if (VALID_ROUTES.includes(route)) {
    EventBus.emit('route-changed', route)
    fireCallbacks(route)
  }
}

function fireCallbacks(route) {
  routeChangeCallbacks.forEach(cb => {
    try { cb(route) } catch (e) { console.error('Router callback error:', e) }
  })
}
