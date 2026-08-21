import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MEGAL DISPLAY",
  description: "Resultados Oficiales del Uruguay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
