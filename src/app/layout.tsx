import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Confirmación de Asistencia - Boda',
  description: 'Confirma tu asistencia a nuestra boda',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
