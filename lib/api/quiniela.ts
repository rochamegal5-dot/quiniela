export interface QuinielaResultado {
  puesto: number
  numero: string
}

export async function obtenerQuiniela(): Promise<QuinielaResultado[]> {
  try {
    const res = await fetch('/api/quiniela', {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('No se pudieron obtener los resultados')
    }

    return await res.json()
  } catch (error) {
    console.error(error)

    return Array.from({ length: 20 }, (_, i) => ({
      puesto: i + 1,
      numero: '----',
    }))
  }
}
