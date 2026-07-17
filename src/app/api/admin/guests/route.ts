import { NextRequest, NextResponse } from 'next/server'
import { getAllGuests } from '@/lib/gcp/sheets'

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar autenticación para el admin
    // Por ahora, cualquiera puede acceder. Considera agregar:
    // - token en query params
    // - Basic Auth
    // - Google OAuth

    const guests = await getAllGuests()
    return NextResponse.json(guests)
  } catch (error) {
    console.error('Error fetching guests for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    )
  }
}
