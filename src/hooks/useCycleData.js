import { useState, useEffect, useCallback } from 'react'

export function useCycleData(key) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(`xidao_${key}`)
    if (saved) {
      try {
        setData(JSON.parse(saved))
      } catch (e) {
        setData([])
      }
    }
    setIsLoading(false)
  }, [key])

  const save = useCallback((newData) => {
    localStorage.setItem(`xidao_${key}`, JSON.stringify(newData))
    setData(newData)
  }, [key])

  const addItem = useCallback((item) => {
    const newData = [item, ...data]
    save(newData)
    return newData
  }, [data, save])

  const removeItem = useCallback((id) => {
    const newData = data.filter(item => item.id !== id)
    save(newData)
    return newData
  }, [data, save])

  const updateItem = useCallback((id, updates) => {
    const newData = data.map(item => item.id === id ? { ...item, ...updates } : item)
    save(newData)
    return newData
  }, [data, save])

  return [data, save, { addItem, removeItem, updateItem, isLoading }]
}