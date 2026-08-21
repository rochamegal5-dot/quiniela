'use client'

import { useEffect, useState } from 'react'

interface TombolaData {
  fecha: string
  vespertina: string[]
  nocturna: string[]
  numeros: string[]
  estado?: string
  ultimaActualizacion?: string
}

interface TombolaCache {
  vespertina: string[]
  nocturna: string[]
  fechaVespertina: string
  fechaNocturna: string
}

const STORAGE_KEY = 'megal-ultimo-tombola'

function leerCache(): TombolaCache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const value = JSON.parse(raw) as Partial<TombolaCache>

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

export default function TombolaSlide() {
  const [data, setData] = useState<TombolaData | null>(null)

  useEffect(() => {
    const cache = leerCache()

    if (cache && (cache.vespertina.length > 0 || cache.nocturna.length > 0)) {
      setData({
        fecha: cache.fechaVespertina || cache.fechaNocturna,
        vespertina: cache.vespertina,
        nocturna: cache.nocturna,
        numeros: cache.vespertina,
        estado: 'CACHE',
      })
    }

    let activo = true

    async function cargar() {
      try {
        const res = await fetch('/api/tombola', { cache: 'no-store' })
        if (!res.ok) throw new Error('Error en API Tómbola')

        const json = (await res.json()) as TombolaData
        const nuevasVespertina = json?.vespertina?.length
          ? json.vespertina
          : json?.numeros ?? []
        const nuevasNocturna = json?.nocturna ?? []
        const cacheActual = leerCache()

        const cacheNuevo: TombolaCache = {
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
              vespertina: cacheNuevo.vespertina,
              nocturna: cacheNuevo.nocturna,
              numeros: cacheNuevo.vespertina,
            })
          }
        }
      } catch (error) {
        console.error('Error cargando Tómbola:', error)
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

  const vespertina = data?.vespertina ?? data?.numeros ?? []
  const nocturna = data?.nocturna ?? []

  return (
    <div className="panel panel-tombola">
      <div className="panel-title">🎱 Tómbola</div>

      <div className="panel-body tombola-panel-body">
        <section className="tombola-section">
          <div className="result-header">Vespertina</div>
          <div className="tombola-grid">
            {vespertina.length > 0 ? (
              vespertina.map((numero, index) => (
                <div key={`v-${index}-${numero}`} className="ball-big">
                  {numero}
                </div>
              ))
            ) : (
              <div className="panel-loading">Esperando resultado vespertino...</div>
            )}
          </div>
        </section>

        <section className="tombola-section">
          <div className="result-header">Nocturna</div>
          <div className="tombola-grid">
            {nocturna.length > 0 ? (
              nocturna.map((numero, index) => (
                <div key={`n-${index}-${numero}`} className="ball-big">
                  {numero}
                </div>
              ))
            ) : (
              <div className="panel-loading">Esperando resultado nocturno...</div>
            )}
          </div>
        </section>

        {data && (
          <div className="last-update">
            Últimos resultados disponibles: {data.fecha || '—'}
          </div>
        )}
      </div>
    </div>
  )
}
