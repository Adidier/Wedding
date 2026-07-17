'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import RSVPForm from '@/components/RSVPForm'
import GuestInfo from '@/components/GuestInfo'
import Loading from '@/components/Loading'

interface GuestData {
  id: string
  name: string
  email: string
  invitationLink: string
  rsvpStatus?: string
  dietaryRestrictions?: string
  partnerName?: string
  numberOfGuests?: number
}

export default function RSVPPage() {
  const searchParams = useSearchParams()
  const guestId = searchParams.get('guest') || searchParams.get('id')
  
  const [guestData, setGuestData] = useState<GuestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!guestId) {
      setError('No guest ID provided')
      setLoading(false)
      return
    }

    const fetchGuestData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/guests/${guestId}`)
        
        if (!response.ok) {
          throw new Error('Guest not found')
        }
        
        const data = await response.json()
        setGuestData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load guest information')
        setGuestData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchGuestData()
  }, [guestId])

  const handleSubmitRSVP = async (formData: any) => {
    if (!guestData) return

    try {
      const response = await fetch(`/api/guests/${guestData.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit RSVP')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit RSVP')
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-wedding-ivory to-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-wedding-burgundy mb-4">Oops!</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-wedding-ivory to-gray-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-wedding-burgundy mb-4">¡Gracias!</h1>
          <p className="text-gray-700 mb-2">Hemos recibido tu confirmación de asistencia.</p>
          <p className="text-sm text-gray-600">Te esperamos el día de nuestra boda.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-wedding-ivory to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-wedding-burgundy mb-2">
            Confirmación de Asistencia
          </h1>
          <div className="w-16 h-1 bg-wedding-gold mx-auto mt-4"></div>
        </div>

        {/* Guest Info */}
        {guestData && <GuestInfo guest={guestData} />}

        {/* RSVP Form */}
        {guestData && <RSVPForm guest={guestData} onSubmit={handleSubmitRSVP} />}
      </div>
    </main>
  )
}
