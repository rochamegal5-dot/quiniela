'use client'

import { useEffect, useState } from 'react'

interface Premio {
  puesto: number
  numero: string
}

interface QuinielaData {
  fecha: string
  sorteo: {
    vespertina: Premio[]
    nocturna: Premio[]
  }
  ultimaActualizacion?: string
  estado?: string
}

interface QuinielaCache {
  vespertina: Premio[]
  nocturna: Premio[]
  fechaVespertina: string
  fechaNocturna: string
}

const STORAGE_KEY = 'megal-ultimo-quiniela'

function leerCache(): QuinielaCache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const value = JSON.parse(raw) as Partial<QuinielaCache>

    if (!Array.isArray(value.vespertina) && !Array.isArray(value.nocturna)) {
      return null
    }

    return {
      vespertina: Array.isArray(value.vespertina) ? value.vespertina : [],
      nocturna: Array.isArray(value.nocturna) ? value.nocturna : [],
      fechaVespertina: value.fechaVespertina ?? '',
      fechaNocturna: value.fechaNocturna ?? '',
    }
  } catch {
    return null
  }
}

export default function QuinielaSlide() {
  const [data, setData] = useState<QuinielaData | null>(null)

  useEffect(() => {
    const cache = leerCache()

    if (cache && (cache.vespertina.length > 0 || cache.nocturna.length > 0)) {
      setData({
        fecha: cache.fechaVespertina || cache.fechaNocturna,
        sorteo: {
          vespertina: cache.vespertina,
          nocturna: cache.nocturna,
        },
        estado: 'CACHE',
      })
    }

    let activo = true

    async function cargar() {
      try {
        const res = await fetch('/api/quiniela', { cache: 'no-store' })
        if (!res.ok) throw new Error('Error en API Quiniela')

        const json = (await res.json()) as QuinielaData
        const nuevasVespertina = json?.sorteo?.vespertina ?? []
        const nuevasNocturna = json?.sorteo?.nocturna ?? []
        const cacheActual = leerCache()

        const cacheNuevo: QuinielaCache = {
          vespertina:
            nuevasVespertina.length > 0
              ? nuevasVespertina
              : cacheActual?.vespertina ?? [],
          nocturna:
            nuevasNocturna.length > 0
              ? nuevasNocturna
              : cacheActual?.nocturna ?? [],
          fechaVespertina:
            nuevasVespertina.length > 0
              ? json.fecha
              : cacheActual?.fechaVespertina ?? '',
          fechaNocturna:
            nuevasNocturna.length > 0
              ? json.fecha
              : cacheActual?.fechaNocturna ?? '',
        }

        if (cacheNuevo.vespertina.length > 0 || cacheNuevo.nocturna.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheNuevo))

          if (activo) {
            setData({
              ...json,
              fecha: cacheNuevo.fechaVespertina || cacheNuevo.fechaNocturna,
              sorteo: {
                vespertina: cacheNuevo.vespertina,
                nocturna: cacheNuevo.nocturna,
              },
            })
          }
        }
      } catch (error) {
        console.error('Error cargando Quiniela:', error)
        // No borramos los últimos resultados guardados.
      }
    }

    cargar()
    const id = setInterval(cargar, 60000)

    return () => {
      activo = false
      clearInterval(id)
    }
  }, [])

  return (
    <div className="panel panel-quiniela">
      <div className="panel-title">🎰 Quiniela</div>

      <div className="panel-body">
        {data ? (
          <>
            <div className="result-column">
              <div className="result-header">Vespertina</div>
              {data.sorteo.vespertina.length > 0 ? (
                data.sorteo.vespertina.slice(0, 10).map((item) => (
                  <div key={`v-${item.puesto}`} className="result-row">
                    <span>{item.puesto}</span>
                    <strong>{item.numero}</strong>
                  </div>
                ))
              ) : (
                <div className="panel-loading">Esperando resultado vespertino...</div>
              )}
            </div>

            <div className="result-column">
              <div className="result-header">Nocturna</div>
              {data.sorteo.nocturna.length > 0 ? (
                data.sorteo.nocturna.slice(0, 10).map((item) => (
                  <div key={`n-${item.puesto}`} className="result-row">
                    <span>{item.puesto}</span>
                    <strong>{item.numero}</strong>
                  </div>
                ))
              ) : (
                <div className="panel-loading">Esperando resultado nocturno...</div>
              )}
            </div>

            <div className="last-update">
              Últimos resultados disponibles: {data.fecha || '—'}
            </div>
          </>
        ) : (
          <div className="panel-loading">Cargando resultados...</div>
        )}
      </div>
    </div>
  )
}
