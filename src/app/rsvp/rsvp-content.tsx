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

export default function RSVPPageContent() {
  const searchParams = useSearchParams()
  const guestId = searchParams.get('guest') || searchParams.get('id')
  const token = searchParams.get('token')
  
  const [guestData, setGuestData] = useState<GuestData | null>(null)
  const [groupMembers, setGroupMembers] = useState<GuestData[] | null>(null)
  const [groupName, setGroupName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // If token is present, fetch group members
    const fetchData = async () => {
      try {
        setLoading(true)

        if (token) {
          const resp = await fetch(`/api/groups/${token}`)
          if (!resp.ok) throw new Error('Group not found')
          const group = await resp.json()
          setGroupMembers(group.members || null)
          setGroupName(group.groupName || null)
          setGuestData(null)
          setError(null)
          return
        }

        if (!guestId) {
          setError('No guest ID provided')
          setGuestData(null)
          return
        }

        const response = await fetch(`/api/guests/${guestId}`)
        if (!response.ok) {
          throw new Error('Guest not found')
        }
        const data = await response.json()
        setGuestData(data)
        setGroupMembers(null)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load information')
        setGuestData(null)
        setGroupMembers(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [guestId, token])

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

  const handleGroupSubmit = async (selectedIds: string[]) => {
    try {
      setLoading(true)
      // Submit RSVP for each member: checked => attendance true, others false
      const promises = (groupMembers || []).map((m) => {
        const attendance = selectedIds.includes(m.id)
        return fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestId: m.id, attendance }),
        })
      })

      const results = await Promise.all(promises)
      const ok = results.every((r) => r.ok)
      if (!ok) throw new Error('One or more RSVPs failed')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit group RSVPs')
    } finally {
      setLoading(false)
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

        {/* Group members flow (token) */}
        {groupMembers && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-primary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-wedding-primary">Invitados — {groupName || 'Familia'}</h2>
                <p className="text-sm text-gray-500">Miembros: <span className="font-medium">{groupMembers.length}</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-wedding-gray">Selecciona los asistentes</p>
              </div>
            </div>
            <GroupRSVPList members={groupMembers} onSubmit={handleGroupSubmit} />
          </div>
        )}

        {/* Guest Info */}
        {guestData && <GuestInfo guest={guestData} />}

        {/* RSVP Form */}
        {guestData && <RSVPForm guest={guestData} onSubmit={handleSubmitRSVP} />}
      </div>
    </main>
  )
}

// Small client component to render members with checkboxes
function GroupRSVPList({ members, onSubmit }: { members: GuestData[]; onSubmit: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    // Preselect members already confirmed
    const init: Record<string, boolean> = {}
    for (const m of members) {
      init[m.id] = (m.rsvpStatus || '').toLowerCase() === 'confirmado'
    }
    return init
  })

  const toggle = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ids = Object.keys(selected).filter((k) => selected[k])
    onSubmit(ids)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={!!selected[m.id]} onChange={() => toggle(m.id)} className="w-4 h-4" />
              <div>
                <div className="font-medium text-wedding-primary">{m.name}</div>
                <div className="text-sm text-gray-500">{m.email}</div>
              </div>
            </div>
            <div className="text-sm text-right">
              <div className="text-gray-600">{m.rsvpStatus ? m.rsvpStatus : 'Pendiente'}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <button type="submit" className="mt-2 bg-gradient-to-r from-wedding-primary to-wedding-rose text-white font-bold py-2 px-5 rounded-lg shadow">
          Confirmar selección
        </button>
      </div>
    </form>
  )
}
