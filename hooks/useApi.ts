'use client'

import { useEffect, useState } from 'react'

export function useApi<T>(loader: () => Promise<T>) {

  const [data, setData] = useState<T | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(false)

  async function load() {

    try {

      setError(false)

      const json = await loader()

      setData(json)

    } catch (e) {

      console.error(e)

      setError(true)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    load()

    const id = setInterval(load, 60000)

    return () => clearInterval(id)

  }, [])

  return {

    data,

    loading,

    error,

    reload: load,

  }

}
