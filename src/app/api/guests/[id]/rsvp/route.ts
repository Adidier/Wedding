import { NextRequest, NextResponse } from 'next/server'
import { updateGuestRSVP } from '@/lib/gcp/sheets'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }

    const result = await updateGuestRSVP(id, {
      attendance: body.attendance,
      dietaryRestrictions: body.dietaryRestrictions,
      comments: body.comments,
      submittedAt: body.submittedAt,
    })

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update RSVP' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'RSVP updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to update RSVP' },
      { status: 500 }
    )
  }
}
