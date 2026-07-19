'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SAMPLE_INVITATIONS } from '@/lib/sampleInvitations'
import RSVPForm from '@/components/RSVPForm'
import type { Invitation } from '@/types'

export default function ConfirmPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const [errorMsg, setError] = useState('')
  const [groupMembersForToken, setGroupMembersForToken] = useState<any[]>([])
  const [loadingGroup, setLoadingGroup] = useState(false)

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
      // Guardar invitado confirmado en localStorage para generar QR después
      try {
        const confirmed = [{
          id: guest?.id,
          nombre: guest?.nombre,
          token: guest?.token,
          attendance: data.data.attendance,
          submittedAt: data.data.submittedAt,
        }]
        localStorage.setItem('confirmedGuests', JSON.stringify(confirmed))
      } catch (e) {
        console.warn('No se pudo guardar en localStorage', e)
      }

      // Redirigir a la página de gracias donde se mostrarán los QR (preservar token)
      const redirectToken = guest?.token ? `?token=${encodeURIComponent(guest.token)}` : ''
      window.location.href = `/gracias${redirectToken}`
    } catch (err) {
      console.error('Error enviando formulario:', err)
      setError('Error al procesar tu confirmación. Por favor intenta de nuevo.')
    }
  }

  useEffect(() => {
    if (!token) return
    let mounted = true
    setLoadingGroup(true)
    fetch(`/api/groups/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error('Group not found')
        return r.json()
      })
      .then((data) => {
        if (!mounted) return
        // Map API members to the format expected by GroupRSVPListTest (nombre, email, id, token, group, rsvp)
        const mapped = (data.members || []).map((m: any) => ({
          id: m.id || m.invitationLink || `id-${Math.random().toString(36).slice(2,8)}`,
          nombre: m.name || m.nombre || '',
          email: m.email || '',
          token: data.token,
          group: data.groupName,
          rsvp: m.rsvpStatus || m.rsvp || '',
        }))
        setGroupMembersForToken(mapped)
      })
      .catch((e) => { console.error(e); setError('No se encontró el token provisto') })
      .finally(() => setLoadingGroup(false))

    return () => { mounted = false }
  }, [token])

  // If no token provided, show a test group RSVP list using SAMPLE_INVITATIONS
  const hasToken = !!token
  const testGroupName = SAMPLE_INVITATIONS[0]?.group || 'Familia de Prueba'
  const testGroupMembers = SAMPLE_INVITATIONS.filter((inv) => inv.group === testGroupName)

  // If token provided but fetch failed
  if (hasToken && !loadingGroup && groupMembersForToken.length === 0) {
    return (
      <main className="min-h-screen bg-wedding-light py-12">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500">
            <div className="text-4xl mb-4 text-center">❌</div>
            <h1 className="text-2xl font-bold text-wedding-primary mb-4 text-center">
              Error
            </h1>
            <p className="text-wedding-gray text-center">{errorMsg || 'No se encontró tu invitación. Por favor verifica el enlace.'}</p>
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
        {/* If token exists, show group members checkboxes for that group */}
        {hasToken && groupMembersForToken.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-primary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-wedding-primary">Invitados — {groupMembersForToken[0]?.group}</h2>
                <p className="text-sm text-gray-500">Miembros: <span className="font-medium">{groupMembersForToken.length}</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-wedding-gray">Selecciona los asistentes</p>
              </div>
            </div>
            <GroupRSVPListTest members={groupMembersForToken} />
          </div>
        )}

        {/* If no token, show test group checkboxes */}
        {!hasToken && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-primary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-wedding-primary">Invitados — {testGroupName}</h2>
                <p className="text-sm text-gray-500">Miembros: <span className="font-medium">{testGroupMembers.length}</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-wedding-gray">Selecciona los asistentes</p>
              </div>
            </div>
            <GroupRSVPListTest members={testGroupMembers} />
          </div>
        )}
      </div>
    </main>
  )
}

function GroupRSVPListTest({ members }: { members: any[] }) {
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const m of members) {
      const r = (m.rsvp || '').toString().toLowerCase()
      init[m.id] = r.includes('confirm') || r.includes('voy') || r.includes('sí') || r.includes('si')
    }
    return init
  })

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }))

  const [showConfirmMissing, setShowConfirmMissing] = useState(false)
  const [missingNames, setMissingNames] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitWithComment = async (commentText = '') => {
    setSubmitting(true)
    try {
      const ids = Object.keys(selected).filter((k) => selected[k])
      const promises = members.map((m) => {
        const attendance = ids.includes(m.id)
        return fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestId: m.id, attendance, comments: attendance ? '' : commentText }),
        })
      })
      const results = await Promise.all(promises)
      if (results.every((r) => r.ok)) {
        // Guardar en localStorage la lista de invitados confirmados para generar QR
        const confirmedGuests = members.filter((m) => ids.includes(m.id)).map((m) => ({
          id: m.id,
          nombre: m.nombre,
          token: m.token,
          group: m.group,
        }))
        try {
          localStorage.setItem('confirmedGuests', JSON.stringify(confirmedGuests))
        } catch (e) {
          console.warn('No se pudo guardar confirmados en localStorage', e)
        }

        // Redirigir a la página de gracias (preservar token from group members)
        const groupToken = members[0]?.token || members[0]?.invitationLink || ''
        const redirect = groupToken ? `/gracias?token=${encodeURIComponent(groupToken)}` : '/gracias'
        window.location.href = redirect
      } else {
        alert('Error al enviar algunas confirmaciones (modo prueba).')
      }
    } catch (err) {
      console.error(err)
      alert('Error al enviar las confirmaciones (modo prueba).')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ids = Object.keys(selected).filter((k) => selected[k])
    const missing = members.filter((m) => !ids.includes(m.id))
    if (missing.length > 0) {
      setMissingNames(missing.map((m) => m.nombre))
      setShowConfirmMissing(true)
      return
    }
    // no missing, submit directly
    submitWithComment('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-4">
                <input type="checkbox" checked={!!selected[m.id]} onChange={() => toggle(m.id)} className="w-4 h-4" />
                <div>
                  <div className="font-medium text-wedding-primary">{m.nombre}</div>
                  <div className="text-sm text-gray-500">{m.email}</div>
                </div>
              </div>
              <div className="text-sm text-right">
                <div className="text-gray-600">{selected[m.id] ? 'Voy a asistir!' : (m.rsvp ? m.rsvp : 'Pendiente')}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <button type="submit" disabled={submitting} className="mt-2 bg-gradient-to-r from-wedding-primary to-wedding-rose text-white font-bold py-2 px-5 rounded-lg shadow disabled:opacity-50">
            {submitting ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </form>

      {showConfirmMissing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowConfirmMissing(false)}></div>
          <div className="bg-white rounded-xl shadow-xl p-6 z-10 max-w-lg w-full">
            <h3 className="text-xl font-bold text-wedding-primary mb-3">Parece que olvidaste confirmar a algunos invitados</h3>
            <p className="text-sm text-gray-600 mb-4">Invitados no seleccionados:</p>
            <ul className="list-disc pl-5 mb-4 text-wedding-primary">
              {missingNames.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <label className="block text-sm font-medium text-wedding-primary mb-2">Comentarios (opcional) para quienes no pueden asistir</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border rounded-md p-2 mb-4" rows={4} placeholder="Si algún invitado no puede asistir, indica el motivo aquí..."></textarea>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded-md border" onClick={() => setShowConfirmMissing(false)}>Volver</button>
              <button className="px-4 py-2 rounded-md bg-wedding-primary text-white" onClick={() => { setShowConfirmMissing(false); submitWithComment(comment) }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
