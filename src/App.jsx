import { useState } from 'react'
import { CycleProvider } from './context/CycleContext'
import Entry from './pages/Entry'
import Island from './pages/Island'

export default function App() {
  // 每次都显示 Entry 页面让用户选择日期
  const [showEntry, setShowEntry] = useState(true)

  return (
    <CycleProvider>
      {showEntry ? (
        <Entry onRegister={() => setShowEntry(false)} />
      ) : (
        <Island onLogout={() => setShowEntry(true)} />
      )}
    </CycleProvider>
  )
}
