// Global error handler - MUST be first to catch import errors
window.onerror = (msg, url, line, col, err) => {
  console.error('Global error:', msg, err)
  document.body.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:#1a1a2e;color:white;padding:2rem;font-family:monospace;z-index:99999">
      <h1 style="color:#e74c3c">ERROR</h1>
      <p>${msg}</p>
      <pre style="color:#e74c3c">${err?.stack || ''}</pre>
    </div>
  `
  return true
}

window.onunhandledrejection = (e) => {
  console.error('Unhandled promise rejection:', e.reason)
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('main.jsx loading...')

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

console.log('React rendered')
