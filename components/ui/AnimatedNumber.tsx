'use client'

import { useEffect, useState } from 'react'

interface Props {
  value: string | number
}

export default function AnimatedNumber({ value }: Props) {

  const [flash, setFlash] = useState(false)

  useEffect(() => {

    setFlash(true)

    const id = setTimeout(() => setFlash(false), 1200)

    return () => clearTimeout(id)

  }, [value])

  return (

    <div className={`animated-number ${flash ? 'flash' : ''}`}>

      {value}

    </div>

  )

}
