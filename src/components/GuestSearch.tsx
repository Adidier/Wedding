'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SAMPLE_INVITATIONS } from '@/lib/sampleInvitations'
import { LeafDivider } from './Decorations'

export default function GuestSearch() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!searchInput.trim()) {
      setError('Por favor ingresa tu nombre')
      return
    }

    setLoading(true)

    // Buscar al invitado por nombre (case-insensitive)
    const guest = SAMPLE_INVITATIONS.find(
      (inv) => inv.name.toLowerCase().includes(searchInput.toLowerCase())
    )

    if (guest) {
      // Redirigir a la página de confirmación con el token
      router.push(`/confirm?token=${guest.token}`)
    } else {
      setError(`No encontramos tu nombre "${searchInput}". Por favor verifica que esté correcto.`)
      setLoading(false)
    }
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
      </div>
    </div>
  )
}
