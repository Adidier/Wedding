'use client'

import { useState } from 'react'

interface GuestData {
  id: string
  name: string
  email: string
  partnerName?: string
  numberOfGuests?: number
}

interface GuestInfoProps {
  guest: GuestData
}

export default function GuestInfo({ guest }: GuestInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-t-4 border-wedding-gold">
      <h2 className="text-2xl font-semibold text-wedding-burgundy mb-4">
        Bienvenido/a, {guest.name}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Nombre</p>
          <p className="font-semibold text-gray-900">{guest.name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Correo Electrónico</p>
          <p className="font-semibold text-gray-900">{guest.email}</p>
        </div>

        {guest.partnerName && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Acompañante</p>
            <p className="font-semibold text-gray-900">{guest.partnerName}</p>
          </div>
        )}

        {guest.numberOfGuests && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Número de Invitados</p>
            <p className="font-semibold text-gray-900">{guest.numberOfGuests}</p>
          </div>
        )}
      </div>
    </div>
  )
}
