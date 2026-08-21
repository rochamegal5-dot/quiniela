'use client'

import { useEffect, useMemo, useState } from 'react'

const slides = [
  { key: 'cotizacion', label: 'Cotización', color: 'verde' },
  { key: 'publicidad', label: 'Publicidad', color: 'azul' },
  { key: 'quiniela', label: 'Quiniela', color: 'dorado' },
  { key: 'cinco', label: '5 de Oro', color: 'rojo' },
  { key: 'tombola', label: 'Tómbola', color: 'morado' },
]

export default function Carousel({ children }: { children: React.ReactNode[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 15000)

    return () => clearInterval(id)
  }, [])

  return (
    <section className="carousel">
      <div className="carousel-nav">
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            className={index === active ? 'carousel-dot active' : 'carousel-dot'}
            onClick={() => setActive(index)}
            aria-label={slide.label}
          />
        ))}
      </div>

      <div className="carousel-slides">
        {children.map((child, index) => (
          <div
            key={index}
            className={index === active ? 'carousel-slide active' : 'carousel-slide'}
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  )
}
