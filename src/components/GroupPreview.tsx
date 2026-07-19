"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function GroupPreview() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const [loading, setLoading] = useState(false)
  const [group, setGroup] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError(null)
    fetch(`/api/groups/${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setGroup(null)
        } else {
          setGroup(data)
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [token])

  if (!token) return null

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-wedding-primary">
        <h3 className="text-xl font-bold text-wedding-primary mb-3">Invitados del grupo</h3>
        {loading && <div className="text-wedding-gray">Cargando invitados...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {group && (
          <div className="space-y-2">
            <div className="text-sm text-wedding-gray">Grupo: <span className="font-medium text-wedding-primary">{group.groupName}</span></div>
            <ul className="mt-3 space-y-2">
              {group.members.map((m: any) => (
                <li key={m.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <div className="font-medium text-wedding-primary">{m.name || m.nombre}</div>
                    <div className="text-sm text-gray-500">{m.email}</div>
                  </div>
                  <div className="text-sm text-gray-600">{m.rsvpStatus || m.rsvp || 'Pendiente'}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <a href={`/confirm?token=${encodeURIComponent(token)}`} className="inline-block bg-wedding-primary text-white px-6 py-2 rounded-md">Confirmar ahora</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
