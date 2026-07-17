'use client'

import { useEffect, useState } from 'react'

interface Guest {
  id: string
  name: string
  email: string
  rsvpStatus?: string
  dietaryRestrictions?: string
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    rejected: 0,
    pending: 0,
  })

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/guests')
        if (response.ok) {
          const data = await response.json()
          setGuests(data)
          
          // Calculate stats
          const confirmed = data.filter((g: Guest) => g.rsvpStatus === 'Confirmado').length
          const rejected = data.filter((g: Guest) => g.rsvpStatus === 'Rechazado').length
          const pending = data.filter((g: Guest) => !g.rsvpStatus).length
          
          setStats({
            total: data.length,
            confirmed,
            rejected,
            pending,
          })
        }
      } catch (error) {
        console.error('Error fetching guests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
    // Refresh every 30 seconds
    const interval = setInterval(fetchGuests, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-wedding-burgundy mb-8">
          Dashboard de Asistencia
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total de Invitados</p>
            <p className="text-3xl font-bold text-wedding-burgundy">{stats.total}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Confirmados</p>
            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Rechazados</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Invitados</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Restricciones Dietéticas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{guest.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          guest.rsvpStatus === 'Confirmado'
                            ? 'bg-green-100 text-green-800'
                            : guest.rsvpStatus === 'Rechazado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {guest.rsvpStatus || 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {guest.dietaryRestrictions || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
