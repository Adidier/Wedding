import { NextRequest, NextResponse } from 'next/server'
import { updateGuestRSVP } from '@/lib/gcp/sheets'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { guestId, attendance, dietaryRestrictions, comments } = body

    if (!guestId) {
      return NextResponse.json(
        { success: false, error: 'ID de invitado requerido' },
        { status: 400 }
      )
    }

    // Guardar en Google Sheets
    const success = await updateGuestRSVP(guestId, {
      attendance,
      dietaryRestrictions,
      comments,
      submittedAt: new Date().toISOString(),
    })

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'No se pudo registrar la confirmación' },
        { status: 400 }
      )
    }

    console.log('RSVP guardado exitosamente:', {
      guestId,
      attendance,
      dietaryRestrictions,
      comments,
    })

    return NextResponse.json({
      success: true,
      message: 'Confirmación registrada exitosamente',
      data: {
        guestId,
        attendance,
        dietaryRestrictions,
        comments,
        submittedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error procesando RSVP:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar la confirmación' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Para verificar que el API está funcionando
  return NextResponse.json({
    status: 'ok',
    message: 'RSVP API funcionando correctamente',
  })
}
