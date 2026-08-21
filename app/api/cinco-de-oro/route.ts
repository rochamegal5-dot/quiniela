import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'

const DNLQ_URL = 'https://www.loteria.gub.uy/ver_resultados.php'

function normalizar(texto: string) {
  return texto.replace(/\s+/g, ' ').trim()
}

function numerosDesde(texto: string, inicio: string, fin: string) {
  const lower = texto.toLowerCase()
  const a = lower.indexOf(inicio.toLowerCase())
  if (a < 0) return []
  const desde = a + inicio.length
  const b = lower.indexOf(fin.toLowerCase(), desde)
  const bloque = texto.slice(desde, b >= 0 ? b : undefined)
  return (bloque.match(/\b\d{2}\b/g) ?? []).slice(0, 6).map(Number)
}

function pozo(texto: string, etiqueta: string) {
  const regex = new RegExp(`${etiqueta}:\\s*\\$\\s*([0-9.,]+)`, 'i')
  return texto.match(regex)?.[1] ? `$ ${texto.match(regex)![1]}` : ''
}

export async function GET() {
  try {
    const res = await fetch(DNLQ_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MegalDisplay/1.0)',
      },
    })
    if (!res.ok) throw new Error(`DNLQ respondió ${res.status}`)

    const html = await res.text()
    const $ = cheerio.load(html)
    const texto = normalizar($('body').text())

    const bolillas = numerosDesde(texto, 'Ganadores del 5 de Oro', 'Pozo de Oro:')
    const revancha = numerosDesde(texto, 'Ganadores del Sorteo Revancha', 'Pozo Revancha:')

    return NextResponse.json({
      fecha:
        texto.match(/\b\d{1,2}\s+de\s+[A-Za-zÁÉÍÓÚáéíóú]+\s+de\s+\d{4}\b/)?.[0] ??
        new Date().toLocaleDateString('es-UY'),
      sorteo: {
        bolillas: bolillas.slice(0, 5),
        bolillaExtra: bolillas[5] ?? null,
        revancha: revancha.slice(0, 5),
        pozoDeOro: pozo(texto, 'Pozo de Oro'),
        pozoRevancha: pozo(texto, 'Pozo Revancha'),
        pozoDePlata: pozo(texto, 'Pozo de Plata'),
      },
      ultimaActualizacion: new Date().toLocaleTimeString('es-UY'),
      estado: 'OK',
    })
  } catch (error) {
    console.error('Error DNLQ 5 de Oro:', error)
    return NextResponse.json({
      fecha: new Date().toLocaleDateString('es-UY'),
      sorteo: {
        bolillas: [],
        bolillaExtra: null,
        revancha: [],
        pozoDeOro: '',
        pozoRevancha: '',
        pozoDePlata: '',
      },
      ultimaActualizacion: new Date().toLocaleTimeString('es-UY'),
      estado: 'SIN_CONEXION',
    })
  }
}
