'use client'

import { Suspense } from 'react'
import ConfirmPageContent from './confirm-content'

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-wedding-light flex items-center justify-center"><p>Cargando...</p></div>}>
      <ConfirmPageContent />
    </Suspense>
  )
}
