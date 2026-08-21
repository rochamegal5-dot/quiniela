'use client'

import { useEffect, useState } from 'react'

export function useFetch<T>(
  url: string
) {
  const [data, setData] = useState<T | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(false)

  async function cargar() {
    try {
      setLoading(true)

      const res = await fetch(url, {
        cache: 'no-store',
      })

      const json = await res.json()

      setData(json)

      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()

    const id = setInterval(cargar, 60000)

    return () => clearInterval(id)
  }, [url])

  return {
    data,
    loading,
    error,
    reload: cargar,
  }
}
