import { NextResponse } from "next/server";

export async function GET() {
  const resultados = [
    { puesto: 1, numero: "5487" },
    { puesto: 2, numero: "1023" },
    { puesto: 3, numero: "8891" },
    { puesto: 4, numero: "7654" },
    { puesto: 5, numero: "2318" },
    { puesto: 6, numero: "9045" },
    { puesto: 7, numero: "4176" },
    { puesto: 8, numero: "6632" },
    { puesto: 9, numero: "5508" },
    { puesto: 10, numero: "1197" },
    { puesto: 11, numero: "8044" },
    { puesto: 12, numero: "6720" },
    { puesto: 13, numero: "3901" },
    { puesto: 14, numero: "8112" },
    { puesto: 15, numero: "2549" },
    { puesto: 16, numero: "1006" },
    { puesto: 17, numero: "7305" },
    { puesto: 18, numero: "9158" },
    { puesto: 19, numero: "4802" },
    { puesto: 20, numero: "3650" },
  ];

  return NextResponse.json(resultados);
}
