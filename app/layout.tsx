import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pagos de la Casa',
  description: 'Gestión de pagos compartidos entre Alberto y Victoria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}

