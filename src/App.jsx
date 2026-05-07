import { useState, useEffect } from 'react'
import { CycleProvider } from './context/CycleContext'
import Entry from './pages/Entry'
import Island from './pages/Island'

export default function App() {
  const [hasRegistered, setHasRegistered] = useState(() => {
    return !!localStorage.getItem('xidao_cycle')
  })

  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('App mounted, hasRegistered:', hasRegistered)
  }, [])

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#e74c3c',
        color: 'white',
        padding: '2rem',
        fontFamily: 'monospace',
        zIndex: 99999,
      }}>
        <h1>ERROR in App</h1>
        <pre>{error.stack}</pre>
      </div>
    )
  }

  return (
    <CycleProvider>
      {hasRegistered ? (
        <Island onLogout={() => {
          localStorage.removeItem('xidao_cycle')
          window.location.reload()
        }} />
      ) : (
        <Entry onRegister={() => setHasRegistered(true)} />
      )}
    </CycleProvider>
  )
}
