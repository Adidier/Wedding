export interface Invitation {
  id: string
  nombre: string
  email: string
  telefono?: string
  token: string
  rsvp: 'pendiente' | 'confirmado' | 'rechazado'
  fechaConfirmacion?: string | null
  numPersonas: number
  notas?: string
  fechaEnvio: string
}

export interface RSVPData {
  invitationId: string
  token: string
  nombre: string
  email: string
  telefono: string
  rsvp: 'confirmado' | 'rechazado'
  numPersonas: number
  restricciones: string
  notas: string
  fechaConfirmacion: string
}

export interface AdminStats {
  totalInvitations: number
  confirmed: number
  rejected: number
  pending: number
  totalGuests: number
}
