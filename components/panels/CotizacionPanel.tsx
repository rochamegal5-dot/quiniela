'use client'

import { useEffect, useState } from 'react'

interface Cotizacion {
  fecha: string
  dolar: string
  euro: string
  uy: string
  dolarCompra: string
  dolarVenta: string
  euroCompra: string
  euroVenta: string
}

export default function CotizacionPanel() {
  const [data, setData] = useState<Cotizacion | null>(null)

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch('/api/cotizacion', { cache: 'no-store' })
        const json = await res.json()
        setData(json)
      } catch {
        setData(null)
      }
    }

    cargar()
    const id = setInterval(cargar, 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="panel panel-cotizacion">
      <div className="panel-title">💱 Cotización</div>
      <div className="panel-body">
        {data ? (
          <div className="cotizacion-grid">
            <div className="cotizacion-item">
              <span>Dólar Compra</span>
              <strong>{data.dolarCompra}</strong>
            </div>
            <div className="cotizacion-item">
              <span>Dólar Venta</span>
              <strong>{data.dolarVenta}</strong>
            </div>
            <div className="cotizacion-item">
              <span>Euro Compra</span>
              <strong>{data.euroCompra}</strong>
            </div>
            <div className="cotizacion-item">
              <span>Euro Venta</span>
              <strong>{data.euroVenta}</strong>
            </div>
            <div className="cotizacion-item">
              <span>UYU</span>
              <strong>{data.uy}</strong>
            </div>
          </div>
        ) : (
          <div className="panel-loading">Cargando cotización...</div>
        )}
      </div>
    </div>
  )
}
