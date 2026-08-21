import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const BROU_URL =
  "https://www.brou.com.uy/c/portal/render_portlet?p_l_id=20593&p_p_id=cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS&p_p_lifecycle=0&p_t_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=0&p_p_col_count=2&p_p_isolated=1&currentURL=%2Fcotizaciones";

function parseValue(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export async function GET() {
  try {
    const res = await fetch(BROU_URL, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      throw new Error(`Error en la consulta de Brou: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const rows = Array.from($("table tbody tr")).map((row) => {
      const moneda = $(row).find("p.moneda").text().trim();
      const valores = $(row)
        .find("p.valor")
        .map((_, el) => parseValue($(el).text()))
        .get();
      return { moneda, valores };
    });

    const dolarRow = rows.find((row) => row.moneda.toLowerCase().includes("dólar") && !row.moneda.toLowerCase().includes("ebrou"));
    const euroRow = rows.find((row) => row.moneda.toLowerCase().includes("euro"));

    if (!dolarRow || !euroRow || dolarRow.valores.length < 2 || euroRow.valores.length < 2) {
      throw new Error("No se pudo extraer la cotización de Brou");
    }

    const [dolarCompra, dolarVenta] = dolarRow.valores;
    const [euroCompra, euroVenta] = euroRow.valores;

    return NextResponse.json({
      fecha: new Date().toLocaleDateString("es-UY"),
      dolar: `${dolarCompra} / ${dolarVenta}`,
      euro: `${euroCompra} / ${euroVenta}`,
      dolarCompra,
      dolarVenta,
      euroCompra,
      euroVenta,
      uy: "UYU 1.00",
      origen: "brou.com.uy",
    });
  } catch (error) {
    console.error("Error al obtener cotizaciones reales", error);

    return NextResponse.json(
      {
        fecha: new Date().toLocaleDateString("es-UY"),
        dolar: "$ 42.50",
        euro: "$ 45.80",
        uy: "$ 1.00",
        origen: "fallback",
      },
      { status: 500 }
    );
  }
}
