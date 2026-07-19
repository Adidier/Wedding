'use client'

import { useSearchParams } from 'next/navigation'

export default function ConfirmButton() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const href = token ? `/confirm?token=${encodeURIComponent(token)}` : '/confirm'

  return (
    <a
      href={href}
      className="inline-block bg-white text-wedding-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-wedding-light hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
    >
      ✅ Confirmar Asistencia
    </a>
  )
}
