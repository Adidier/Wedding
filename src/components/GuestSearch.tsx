'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SAMPLE_INVITATIONS } from '@/lib/sampleInvitations'
import { LeafDivider } from './Decorations'

export default function GuestSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const [searchInput, setSearchInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [groupInfo, setGroupInfo] = useState<any | null>(null)

  useEffect(() => {
    // If a token is present in the URL, fetch the group/guest info and show the fixed name
    if (!token) return

    const fetchGroup = async () => {
      try {
        setLoading(true)
        const resp = await fetch(`/api/groups/${token}`)
        if (!resp.ok) throw new Error('Group not found')
        const g = await resp.json()
        setGroupInfo(g)
      } catch (err) {
        // Fallback to SAMPLE_INVITATIONS grouping
        const map: Record<string, any[]> = {}
        for (const s of SAMPLE_INVITATIONS as any[]) {
          const group = s.group || 'Unknown'
          if (!map[group]) map[group] = []
          map[group].push(s)
        }
        const found = Object.keys(map).map((g) => ({ groupName: g, token: g && g.length ? g : '', members: map[g] })).find((gg) => gg.token === token || gg.token === token)
        if (found) setGroupInfo(found)
        else setError('No se encontró el token provisto')
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [token])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!searchInput.trim()) {
      setError('Por favor ingresa tu nombre')
      return
    }

    setLoading(true)

    // Buscar al invitado por nombre (case-insensitive). Support both `name` and `nombre` fields.
    const guest = SAMPLE_INVITATIONS.find((inv: any) => {
      const nm = (inv.name || inv.nombre || '').toString()
      return nm.toLowerCase().includes(searchInput.toLowerCase())
    })

    if (guest) {
      // Redirigir a la página de confirmación con el token
      router.push(`/confirm?token=${guest.token}`)
    } else {
      setError(`No encontramos tu nombre "${searchInput}". Por favor verifica que esté correcto.`)
      setLoading(false)
    }
  }

  // If token present and we have groupInfo, show fixed name(s)
  if (token) {
    return (
      <div className="max-w-2xl mx-auto mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-wedding-primary relative overflow-hidden">
          <h2 className="text-3xl font-bold text-wedding-primary mb-2 text-center">Tu Invitación</h2>
          {loading && <p className="text-center text-gray-500">Cargando...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {groupInfo && (
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-2">Grupo:</p>
              <h3 className="text-4xl font-bold text-wedding-primary mb-4">{groupInfo.groupName || 'Invitados'}</h3>
              <p className="text-gray-700 mb-4">Miembros del grupo:</p>
              <ul className="space-y-2 text-left inline-block">
                {groupInfo.members.map((m: any) => (
                  <li key={m.id} className="px-4 py-2 border rounded-md">{m.name || m.nombre}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mb-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-wedding-primary relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -top-8 -right-8 opacity-10 text-6xl">💐</div>

        <h2 className="text-3xl font-bold text-wedding-primary mb-2 text-center">
          ¿Cuál es tu nombre?
        </h2>
        <p className="text-wedding-gray text-center mb-6">
          Ingresa tu nombre para acceder a tu invitación personalizada
        </p>

        <LeafDivider />

        <form onSubmit={handleSearch} className="mt-8">
          <div className="mb-6">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setError('')
              }}
              placeholder="Ej: Juan López"
              className="w-full px-6 py-4 border-2 border-wedding-sand rounded-xl focus:outline-none focus:border-wedding-primary focus:bg-wedding-light transition-all text-lg"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all ${
              loading || !searchInput.trim()
                ? 'bg-wedding-sand cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-wedding-primary to-wedding-rose hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando...
              </span>
            ) : (
              '✅ Buscar mi Invitación'
            )}
          </button>
        </form>

        <p className="text-center text-wedding-gray text-sm mt-6">
          Si tienes problemas, contáctanos a través del email en tu invitación original
        </p>
        <div className="mt-4 text-sm text-gray-600">
          <div className="mb-2 font-semibold text-gray-700">Nombres de ejemplo (clic para autocompletar):</div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_INVITATIONS.map((s: any) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSearchInput((s.name || s.nombre || '').toString())}
                className="px-3 py-1 bg-wedding-sand rounded-full text-sm hover:bg-wedding-primary/10"
              >
                {s.name || s.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
