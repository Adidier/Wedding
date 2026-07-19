'use client'

import { Suspense } from 'react'
import RSVPPageContent from './rsvp-content'

export default function RSVPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-wedding-light flex items-center justify-center"><p>Cargando...</p></div>}>
      <RSVPPageContent />
    </Suspense>
  )
}
