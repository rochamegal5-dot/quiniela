'use client'

import { useEffect, useRef, useState } from 'react'

type MediaItem = {
  type: 'video' | 'image'
  src: string
  duration?: number
}

const FALLBACK_PLAYLIST: MediaItem[] = [
  { type: 'video', src: '/media/videos/megal.mp4' },
]

export default function MediaPlayer() {
  const [playlist, setPlaylist] = useState<MediaItem[]>(FALLBACK_PLAYLIST)
  const [index, setIndex] = useState(0)
  const [error, setError] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const siguiente = () => {
    setIndex((current) => (current + 1) % Math.max(playlist.length, 1))
  }

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        const res = await fetch('/api/media', { cache: 'no-store' })
        if (!res.ok) throw new Error('No se pudo cargar la publicidad')
        const data = await res.json()
        if (!activo || !Array.isArray(data) || data.length === 0) return

        const validos = data.filter(
          (item: MediaItem) =>
            item &&
            (item.type === 'video' || item.type === 'image') &&
            typeof item.src === 'string' &&
            item.src.length > 0,
        )

        if (validos.length) setPlaylist(validos)
      } catch {
        // El video local queda como respaldo.
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    const actual = playlist[index]
    if (!actual || actual.type !== 'image') return

    timer.current = setTimeout(siguiente, actual.duration ?? 8000)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [playlist, index])

  const actual = playlist[index] ?? FALLBACK_PLAYLIST[0]

  return (
    <div className="media-player" aria-label="Publicidad Megal Rocha">
      {actual.type === 'video' ? (
        <video
          key={actual.src}
          src={actual.src}
          autoPlay
          muted
          loop={playlist.length === 1}
          playsInline
          preload="auto"
          controls={false}
          onEnded={playlist.length > 1 ? siguiente : undefined}
          onError={() => setError(true)}
        />
      ) : (
        <img
          key={actual.src}
          src={actual.src}
          alt="Publicidad Megal Rocha"
          onError={() => setError(true)}
        />
      )}

      {error && (
        <div className="media-error">
          <strong>MEGAL ROCHA</strong>
          <span>Publicidad no disponible temporalmente</span>
        </div>
      )}
    </div>
  )
}
