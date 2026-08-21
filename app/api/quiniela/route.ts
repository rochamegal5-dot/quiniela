import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'

const DNLQ_URL = 'https://www.loteria.gub.uy/ver_resultados.php'

type Premio = { puesto: number; numero: string }

function normalizar(texto: string) {
  return texto.replace(/\s+/g, ' ').trim()
}

function extraerBloque(texto: string, inicio: string, fin: string) {
  const lower = texto.toLowerCase()
  const a = lower.indexOf(inicio.toLowerCase())
  if (a < 0) return ''
  const desde = a + inicio.length
  const b = fin ? lower.indexOf(fin.toLowerCase(), desde) : -1
  return texto.slice(desde, b >= 0 ? b : undefined)
}

function premiosDeBloque(bloque: string): Premio[] {
  const encontrados = bloque.match(/\b\d{3}\b/g) ?? []
  return encontrados.slice(0, 20).map((numero, index) => ({
    puesto: index + 1,
    numero,
  }))
}

export async function GET() {
  const vacio = {
    vespertina: [] as Premio[],
    nocturna: [] as Premio[],
  }

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

    const vespertina = premiosDeBloque(
      extraerBloque(
        texto,
        'TABLA QUINIELA Y TOMBOLA VESPERTINA',
        'Próximo Vespertino:',
      ),
    )

    const nocturna = premiosDeBloque(
      extraerBloque(
        texto,
        'TABLA QUINIELA Y TOMBOLA NOCTURNO',
        'Próximo Nocturno:',
      ),
    )

    const fecha =
      texto.match(/\b\d{1,2}\s+de\s+[A-Za-zÁÉÍÓÚáéíóú]+\s+de\s+\d{4}\b/)?.[0] ??
      new Date().toLocaleDateString('es-UY')

    return NextResponse.json({
      fecha,
      sorteo: { vespertina, nocturna },
      ultimaActualizacion: new Date().toLocaleTimeString('es-UY'),
      estado: 'OK',
    })
  } catch (error) {
    console.error('Error DNLQ quiniela:', error)
    return NextResponse.json({
      fecha: new Date().toLocaleDateString('es-UY'),
      sorteo: vacio,
      ultimaActualizacion: new Date().toLocaleTimeString('es-UY'),
      estado: 'SIN_CONEXION',
    })
  }
}
