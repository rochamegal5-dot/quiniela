export function formatearHora(fecha: Date) {
  return fecha.toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatearFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-UY", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatearNumero(numero: number | string) {
  return String(numero).padStart(2, "0");
}

export function formatearQuiniela(numero: number | string) {
  return String(numero).padStart(4, "0");
}

export function formatearDinero(valor: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function tiempoActualizacion() {
  return new Date().toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
