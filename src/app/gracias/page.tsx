"use client"

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'

type ConfirmedGuest = {
  id: string
  nombre: string
  token?: string
  group?: string
}

export default function GraciasPage() {
  const [guests, setGuests] = useState<ConfirmedGuest[] | null>(null)
  const [qrMap, setQrMap] = useState<Record<string, string>>({})

  useEffect(() => {
    // Primero intentar cargar confirmaciones desde el servidor (admin endpoint)
    let mounted = true
    const fetchConfirmedFromServer = async () => {
      try {
        const res = await fetch('/api/admin/guests')
        if (!res.ok) throw new Error('No se pudo obtener desde servidor')
        const allGuests = await res.json()
        // Filtrar confirmados
        const confirmed = allGuests.filter((g: any) => (g.rsvpStatus || '').toLowerCase().includes('confirm'))
        const mapped = confirmed.map((g: any) => ({ id: g.id, nombre: g.name || g.nombre || '', token: g.token, group: (g.group || g.groupName) }))
        if (mounted) {
          if (mapped.length === 0) {
            // If server returned no confirmed guests, fallback to localStorage if available
            try {
              const raw = localStorage.getItem('confirmedGuests')
              if (raw) {
                const parsed = JSON.parse(raw) as ConfirmedGuest[]
                setGuests(parsed)
                parsed.forEach(async (g) => {
                  try {
                    const payload = JSON.stringify({ id: g.id, token: g.token })
                    const dataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 300 })
                    setQrMap((s) => ({ ...s, [g.id]: dataUrl }))
                  } catch (e) {
                    console.warn('Error generando QR para', g.id, e)
                  }
                })
                return
              }
            } catch (e) {
              console.warn('Error leyendo localStorage', e)
            }
          }
          setGuests(mapped)
          // generar QR para cada invitado
          mapped.forEach(async (g) => {
            try {
              const payload = JSON.stringify({ id: g.id, token: g.token })
              const dataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 300 })
              setQrMap((s) => ({ ...s, [g.id]: dataUrl }))
            } catch (e) {
              console.warn('Error generando QR para', g.id, e)
            }
          })
        }
      } catch (err) {
        // Fallback a localStorage si algo falla
        try {
          const raw = localStorage.getItem('confirmedGuests')
          if (!raw) {
            if (mounted) setGuests([])
            return
          }
          const parsed = JSON.parse(raw) as ConfirmedGuest[]
          if (mounted) setGuests(parsed)
          parsed.forEach(async (g) => {
            try {
              const payload = JSON.stringify({ id: g.id, token: g.token })
              const dataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 300 })
              setQrMap((s) => ({ ...s, [g.id]: dataUrl }))
            } catch (e) {
              console.warn('Error generando QR para', g.id, e)
            }
          })
        } catch (e) {
          console.warn('No hay invitados confirmados en localStorage', e)
          if (mounted) setGuests([])
        }
      }
    }

    fetchConfirmedFromServer().then(() => {
      if (!mounted) return
      try {
        const raw = localStorage.getItem('confirmedGuests')
        if (raw && raw.length > 0) return
      } catch (e) {
        // ignore
      }

      // Try token-based fallback: if page opened with ?token=..., fetch group members
      try {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        if (!token) return
        fetch(`/api/groups/${token}`)
          .then((r) => {
            if (!r.ok) throw new Error('Group not found')
            return r.json()
          })
          .then((data) => {
            if (!mounted) return
            const mapped = (data.members || []).map((m: any) => ({ id: m.id || m.invitationLink || `id-${Math.random().toString(36).slice(2,8)}`, nombre: m.name || m.nombre || '', token: data.token, group: data.groupName }))
            setGuests(mapped)
            // generate QR images
            mapped.forEach(async (g) => {
              try {
                const payload = JSON.stringify({ id: g.id, token: g.token })
                const dataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 300 })
                setQrMap((s) => ({ ...s, [g.id]: dataUrl }))
              } catch (e) {
                console.warn('Error generando QR para', g.id, e)
              }
            })
          })
          .catch(() => {})
      } catch (e) {}
    })

    return () => { mounted = false }
  }, [])

  if (guests === null) {
    return <div className="p-8">Cargando...</div>
  }

  if (guests.length === 0) {
    return (
      <main className="min-h-screen bg-wedding-light py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-primary text-center">
            <h1 className="text-3xl font-bold text-wedding-primary mb-4">Gracias</h1>
            <p className="text-wedding-gray">No se encontraron confirmaciones recientes.</p>
            <div className="mt-6">
              <a href="/" className="inline-block bg-wedding-primary text-white px-6 py-3 rounded-md">Volver al inicio</a>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-wedding-light py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-primary text-center">
          <h1 className="text-4xl font-bold text-wedding-primary mb-3">¡Gracias por confirmar!</h1>
          <p className="text-wedding-gray mb-6">Aquí tienes el código QR para cada invitado confirmado. Guárdalo o descárgalo para mostrarlo en la entrada.</p>

          <div className="mb-4 flex justify-center gap-3">
            <button onClick={async () => {
              try {
                await generatePdf()
              } catch (e) {
                console.error('Error generando PDF', e)
                alert('Error generando PDF')
              }
            }} className="bg-wedding-primary text-white px-4 py-2 rounded-md">Descargar PDF</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guests.map((g) => (
              <div key={g.id} className="p-4 border rounded-lg text-center">
                <div className="font-semibold text-wedding-primary mb-2">{g.nombre}</div>
                {qrMap[g.id] ? (
                  <>
                    <img src={qrMap[g.id]} alt={`QR ${g.nombre}`} className="mx-auto mb-3" />
                    <a href={qrMap[g.id]} download={`qr-${g.nombre.replace(/\s+/g, '_')}.png`} className="inline-block bg-wedding-primary text-white px-4 py-2 rounded-md">Descargar QR</a>
                  </>
                ) : (
                  <div>Generando QR...</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a href="/" className="inline-block bg-wedding-primary text-white px-6 py-3 rounded-md">Volver al inicio</a>
          </div>
        </div>
      </div>
    </main>
  )
}

async function generatePdf() {
  // Basic event info (customize as needed)
  const EVENT_TITLE = 'Boda — 7 de Noviembre de 2026'
  const EVENT_VENUE = 'Iglesia Nuestra Señora - Ciudad'
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 15
  let x = margin
  let y = 25
  doc.setFontSize(18)
  doc.text(EVENT_TITLE, margin, y)
  y += 8
  doc.setFontSize(12)
  doc.text(EVENT_VENUE, margin, y)
  y += 10

  // Read confirmed guests from localStorage (the page already fetched server-side; use local storage fallback)
  let confirmed: any[] = []
  try {
    const raw = localStorage.getItem('confirmedGuests')
    if (raw) confirmed = JSON.parse(raw)
  } catch (e) {
    console.warn('No confirmedGuests in localStorage', e)
  }

  if (!confirmed || confirmed.length === 0) {
    // Try to read from window.__confirmedGuests if page set it (not used now)
  }

  const perRow = 2
  const qrSize = 40 // mm
  const gap = 10
  y += 4

  doc.setFontSize(14)
  doc.text('Invitados confirmados:', margin, y)
  y += 8

  for (let i = 0; i < confirmed.length; i++) {
    const g = confirmed[i]
    const col = i % perRow
    const row = Math.floor(i / perRow)
    const posX = margin + col * (qrSize + 60)
    const posY = y + row * (qrSize + 30)

    if (posY + qrSize + margin > 295) {
      doc.addPage()
      y = margin
    }

    // Add name
    doc.setFontSize(12)
    doc.text(`${g.nombre || g.name || 'Invitado'}`, posX, posY + 6)

    // Get QR dataURL from DOM by rebuilding payload (or reading from localStorage)
    try {
      const payload = JSON.stringify({ id: g.id, token: g.token })
      // Generate QR dataURL synchronously using QRCode.toDataURL (returns promise)
      // But here we create an offscreen canvas by using QRCode.toDataURL
      // Since generatePdf is async, this is allowed
      // @ts-ignore
      const dataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 2, width: 300 })
      doc.addImage(dataUrl, 'PNG', posX, posY + 8, qrSize, qrSize)
    } catch (e) {
      console.warn('No se pudo generar QR para PDF', g, e)
    }
  }

  doc.save('confirmaciones.pdf')
}
