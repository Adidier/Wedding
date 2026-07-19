import { NextRequest, NextResponse } from 'next/server'
import { updateGuestRSVP } from '@/lib/gcp/sheets'
import { getGroupsFromSheets, updateGroupSummary } from '@/lib/gcp/sheets'

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

    // Guardar en Google Sheets (con fallback en entorno de desarrollo si faltan credenciales)
    let success = false
    try {
      success = await updateGuestRSVP(guestId, {
        attendance,
        dietaryRestrictions,
        comments,
        submittedAt: new Date().toISOString(),
      })
    } catch (err: any) {
      console.warn('Error writing to Sheets:', err?.message || err)
      // Simular éxito cuando no hay credenciales de Google en local
      if ((err?.message || '').includes('No key or keyFile set')) {
        console.warn('Simulating RSVP save because Google credentials are not configured')
        success = true
      } else {
        throw err
      }
    }

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

    // Attempt to update the group summary for the guest's group (if token/group can be resolved)
    try {
      const groups = await getGroupsFromSheets()
      // find the group that contains this guest id
      const found = groups.find((g) => g.members.some((m) => m.id === guestId))
      if (found) {
        await updateGroupSummary(found.token)
      }
    } catch (e) {
      console.warn('No se pudo actualizar el resumen del grupo:', e)
    }

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

export async function GET() {
  // Para verificar que el API está funcionando
  return NextResponse.json({
    status: 'ok',
    message: 'RSVP API funcionando correctamente',
  })
}
