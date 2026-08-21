'use client'

import { useEffect } from 'react'

export function useAutoRefresh(
  callback: () => void | Promise<void>,
  interval = 60000
) {
  useEffect(() => {
    callback()

    const id = setInterval(() => {
      callback()
    }, interval)

    return () => clearInterval(id)
  }, [])
}
