'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SAMPLE_INVITATIONS } from '@/lib/sampleInvitations'
import RSVPForm from '@/components/RSVPForm'
import type { Invitation } from '@/types'
import { FloralDivider, LeafDivider } from '@/components/Decorations'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  
  // Buscar el invitado directamente sin setState para token
  const token = searchParams?.get('token')
  const guest = token ? SAMPLE_INVITATIONS.find(inv => inv.token === token) as Invitation | undefined : undefined
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId: guest?.id,
          attendance: formData.attendance,
          dietaryRestrictions: formData.dietaryRestrictions,
          comments: formData.comments,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar la confirmación')
        return
      }

      setSubmittedData(data.data)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Error enviando formulario:', err)
      setError('Error al procesar tu confirmación. Por favor intenta de nuevo.')
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-wedding-light py-12">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-primary">
            <div className="text-4xl mb-4 text-center">⚠️</div>
            <h1 className="text-2xl font-bold text-wedding-primary mb-4 text-center">
              Error de Acceso
            </h1>
            <p className="text-wedding-gray text-center">
              No se encontró un token válido. Por favor, utiliza el enlace completo de tu invitación.
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!guest) {
    return (
      <main className="min-h-screen bg-wedding-light py-12">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500">
            <div className="text-4xl mb-4 text-center">❌</div>
            <h1 className="text-2xl font-bold text-wedding-primary mb-4 text-center">
              Error
            </h1>
            <p className="text-wedding-gray text-center">
              No se encontró tu invitación. Por favor verifica el enlace.
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Mostrar mensaje de confirmación exitosa
  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-wedding-light py-12">
        <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-12 border-t-4 border-wedding-primary text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-wedding-primary mb-3">
              ¡Gracias, {guest.nombre}!
            </h1>
            <p className="text-xl text-wedding-gray mb-8">
              Tu confirmación ha sido registrada exitosamente
            </p>

            <div className="bg-wedding-light rounded-xl p-6 mb-8 text-left">
              <h2 className="text-lg font-bold text-wedding-primary mb-4">Resumen de tu confirmación:</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-wedding-primary">Boletos Asignados:</span>
                  <span className="ml-2 text-wedding-gray text-lg font-bold">🎟️ {guest.numPersonas}</span>
                </div>
                <div>
                  <span className="font-semibold text-wedding-primary">Asistencia:</span>
                  <span className="ml-2 text-wedding-gray">
                    {submittedData?.attendance ? '✅ Sí, estaré presente' : '❌ Lamentablemente no podré asistir'}
                  </span>
                </div>
                {submittedData?.dietaryRestrictions && (
                  <div>
                    <span className="font-semibold text-wedding-primary">Restricciones Dietéticas:</span>
                    <span className="ml-2 text-wedding-gray">{submittedData.dietaryRestrictions}</span>
                  </div>
                )}
                {submittedData?.comments && (
                  <div>
                    <span className="font-semibold text-wedding-primary">Mensaje:</span>
                    <p className="ml-2 text-wedding-gray italic">{submittedData.comments}</p>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-wedding-primary">Fecha de confirmación:</span>
                  <span className="ml-2 text-wedding-gray">
                    {new Date(submittedData?.submittedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-wedding-primary/10 to-wedding-rose/10 rounded-xl border-2 border-wedding-primary/30">
              <p className="text-wedding-primary font-semibold">
                📅 Te esperamos el <span className="text-lg">7 de Noviembre de 2026</span>
              </p>
              <p className="text-wedding-gray text-sm mt-2">
                Pronto recibirás más detalles sobre la ubicación y horario de la ceremonia
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="bg-wedding-primary hover:bg-wedding-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg"
            >
              ← Volver a la página de inicio
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-wedding-light py-12">
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>
      <div className="container mx-auto px-4 max-w-2xl">
        <RSVPForm guest={guest} onSubmit={handleFormSubmit} />
      </div>
    </main>
  )
}
