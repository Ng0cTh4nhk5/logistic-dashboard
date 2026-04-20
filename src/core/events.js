/**
 * Simple pub/sub event bus for decoupled module communication.
 */

const listeners = {}

export const EventBus = {
  on(event, callback) {
    if (!listeners[event]) listeners[event] = new Set()
    listeners[event].add(callback)
  },

  off(event, callback) {
    if (listeners[event]) listeners[event].delete(callback)
  },

  emit(event, data) {
    if (listeners[event]) {
      listeners[event].forEach(cb => {
        try { cb(data) } catch (e) { console.error(`EventBus error on "${event}":`, e) }
      })
    }
  }
}

// Events used across the app:
// 'config-changed' → emitted by Store.setConfig → Dashboard re-renders
// 'route-changed'  → emitted by Router → main.js renders correct page
