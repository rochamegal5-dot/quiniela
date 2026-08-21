'use client'

import { useEffect, useState } from 'react'

interface FiveGoldData {
  fecha: string
  sorteo: {
    bolillas: number[]
    bolillaExtra?: number | null
    revancha: number[]
    pozoDeOro?: string
    pozoRevancha?: string
    pozoDePlata?: string
  }
  ultimaActualizacion?: string
  estado?: string
}

const STORAGE_KEY = 'megal-ultimo-5-de-oro'

function leerCache(): FiveGoldData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const value = JSON.parse(raw) as FiveGoldData

    if (!value?.sorteo?.bolillas?.length) return null

    return value
  } catch {
    return null
  }
}

export default function CincoDeOroSlide() {
  const [data, setData] = useState<FiveGoldData | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cache = leerCache()

    if (cache) setData(cache)

    let activo = true

    async function cargar() {
      try {
        const res = await fetch('/api/cinco-de-oro', { cache: 'no-store' })
        if (!res.ok) throw new Error('Error en API 5 de Oro')

        const json = (await res.json()) as FiveGoldData
        const bolillas = json?.sorteo?.bolillas ?? []

        // Solamente reemplazamos el resultado anterior cuando llegaron
        // bolillas reales. Una respuesta vacía NO borra el último sorteo.
        if (bolillas.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json))
          if (activo) setData(json)
        }
      } catch (error) {
        console.error('Error cargando 5 de Oro:', error)
        // Conservamos el último resultado disponible.
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()
    const id = setInterval(cargar, 60000)

    return () => {
      activo = false
      clearInterval(id)
    }
  }, [])

  if (cargando && !data) {
    return (
      <div className="panel panel-cinco">
        <div className="panel-title">🏆 5 de Oro</div>
        <div className="panel-body">
          <div className="panel-loading">Cargando resultados...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel panel-cinco">
      <div className="panel-title">🏆 5 de Oro</div>

      <div className="panel-body">
        {data ? (
          <>
            <div className="result-date">Último resultado: {data.fecha}</div>

            <div className="result-list-small">
              {data.sorteo.bolillas.map((numero, index) => (
                <div key={`oro-${index}-${numero}`} className="ball-big">
                  {String(numero).padStart(2, '0')}
                </div>
              ))}
            </div>

            {data.sorteo.revancha?.length > 0 && (
              <>
                <div className="result-subtitle">REVANCHA</div>
                <div className="result-list-small">
                  {data.sorteo.revancha.map((numero, index) => (
                    <div key={`rev-${index}-${numero}`} className="ball-big silver">
                      {String(numero).padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </>
            )}

            {data.sorteo.pozoDeOro && (
              <div className="pozo-info">Pozo: {data.sorteo.pozoDeOro}</div>
            )}

            <div className="last-update">
              Últimos resultados disponibles: {data.fecha}
            </div>
          </>
        ) : (
          <div className="panel-loading">
            Aún no hay resultados guardados.
          </div>
        )}
      </div>
    </div>
  )
}
