import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'

const DNLQ_URL = 'https://www.loteria.gub.uy/ver_resultados.php'

function normalizar(texto: string) {
  return texto.replace(/\s+/g, ' ').trim()
}

function bloque(texto: string, inicio: string, fin: string) {
  const lower = texto.toLowerCase()
  const a = lower.indexOf(inicio.toLowerCase())
  if (a < 0) return ''
  const desde = a + inicio.length
  const b = fin ? lower.indexOf(fin.toLowerCase(), desde) : -1
  return texto.slice(desde, b >= 0 ? b : undefined)
}

function extraerTombola(bloqueTexto: string) {
  const nums = bloqueTexto.match(/\b\d{2}\b/g) ?? []
  // La fecha del sorteo aparece antes de la tabla. Los últimos 20 son la Tómbola.
  return nums.slice(-20)
}

export async function GET() {
  try {
    const res = await fetch(DNLQ_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MegalDisplay/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })

    if (!res.ok) throw new Error(`DNLQ respondió ${res.status}`)

    const html = await res.text()
    const $ = cheerio.load(html)
    const texto = normalizar($('body').text())

    const vespertina = extraerTombola(
      bloque(texto, 'TABLA TOMBOLA VESPERTINA', 'Próximo Vespertino:'),
    )

    const nocturna = extraerTombola(
      bloque(texto, 'TABLA TOMBOLA NOCTURNO', 'Próximo Nocturno:'),
    )

    return NextResponse.json({
      fecha:
        texto.match(/\b\d{1,2}\s+de\s+[A-Za-zÁÉÍÓÚáéíóú]+\s+de\s+\d{4}\b/)?.[0] ??
        new Date().toLocaleDateString('es-UY'),
      vespertina,
      nocturna,
      // Mantengo 'numeros' para compatibilidad con el panel actual.
      numeros: vespertina,
      ultimaActualizacion: new Date().toLocaleTimeString('es-UY'),
      estado: 'OK',
    })
  } catch (error) {
    console.error('Error DNLQ tómbola:', error)
    return NextResponse.json({
      fecha: new Date().toLocaleDateString('es-UY'),
      vespertina: [],
      nocturna: [],
      numeros: [],
      ultimaActualizacion: new Date().toLocaleTimeString('es-UY'),
      estado: 'SIN_CONEXION',
    })
  }
}
