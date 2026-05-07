import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CycleContext = createContext(null)

const CYCLE_LENGTH = 28
const PERIOD_LENGTH = 5

export function CycleProvider({ children }) {
  const [cycleData, setCycleData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('xidao_cycle')
      if (saved) {
        const data = JSON.parse(saved)
        setCycleData(data)
      }
    } catch (e) {
      console.error('Error loading cycle data:', e)
    }
    setIsLoading(false)
  }, [])

  // Calculate cycle day and phase from lastPeriod date
  const computedData = useMemo(() => {
    if (!cycleData?.lastPeriod) return null

    const lastPeriodDate = new Date(cycleData.lastPeriod)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    lastPeriodDate.setHours(0, 0, 0, 0)

    const daysSinceLastPeriod = Math.floor((today - lastPeriodDate) / (1000 * 60 * 60 * 24))
    const cycleDay = (daysSinceLastPeriod % CYCLE_LENGTH) + 1

    let phase, phaseName
    if (cycleDay <= PERIOD_LENGTH) {
      phase = 'period'
      phaseName = '月经期'
    } else if (cycleDay <= 13) {
      phase = 'follicular'
      phaseName = '卵泡期'
    } else if (cycleDay <= 16) {
      phase = 'ovulation'
      phaseName = '排卵日'
    } else {
      phase = 'luteal'
      phaseName = '黄体期'
    }

    return {
      ...cycleData,
      cycleDay,
      phase: { name: phase, label: phaseName },
      daysUntilPeriod: CYCLE_LENGTH - daysSinceLastPeriod % CYCLE_LENGTH,
    }
  }, [cycleData])

  const register = (lastPeriod, duration) => {
    const data = { lastPeriod, duration }
    localStorage.setItem('xidao_cycle', JSON.stringify(data))
    setCycleData(data)
    return data
  }

  const clearData = () => {
    localStorage.removeItem('xidao_cycle')
    setCycleData(null)
  }

  const value = {
    cycleData: computedData,
    isLoading,
    register,
    clearData,
  }

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  )
}

export function useCycle() {
  const context = useContext(CycleContext)
  if (!context) {
    console.error('useCycle called outside CycleProvider')
    return { cycleData: null, isLoading: false, register: () => {}, clearData: () => {} }
  }
  return context
}
