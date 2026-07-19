import { NextRequest, NextResponse } from 'next/server'
import { getGuestFromSheets } from '@/lib/gcp/sheets'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }

    const guestData = await getGuestFromSheets(id)

    if (!guestData) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(guestData)
  } catch (error) {
    console.error('Error fetching guest:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guest information' },
      { status: 500 }
    )
  }
}
