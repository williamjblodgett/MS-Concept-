import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'ms-home-finder-favorites'

function loadFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return new Set(JSON.parse(stored))
  } catch {}
  return new Set()
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
  }, [favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
