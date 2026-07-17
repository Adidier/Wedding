'use client'

import { useState } from 'react'
import { LeafDivider, FlowerAccent } from './Decorations'

interface GuestData {
  id: string
  nombre: string
  email: string
  numPersonas?: number
}

interface RSVPFormProps {
  guest: GuestData
  onSubmit: (formData: any) => void
}

export default function RSVPForm({ guest, onSubmit }: RSVPFormProps) {
  const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!attendance) {
      alert('Por favor selecciona si asistirás o no')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        guestId: guest.id,
        attendance: attendance === 'yes',
        dietaryRestrictions,
        comments,
        submittedAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-10 md:p-16 border-t-4 border-wedding-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 opacity-10 text-6xl">💐</div>
      <div className="absolute -bottom-8 -left-8 opacity-10 text-6xl">✿</div>
      
      <div className="mb-8 text-center">
        <span className="inline-block text-wedding-primary font-bold text-sm tracking-widest uppercase bg-wedding-light px-4 py-2 rounded-full mb-6">
          ✨ Invitación Personal ✨
        </span>
      </div>

      <div className="mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-wedding-primary mb-3">
          Querido {guest.nombre},
        </h2>
        <p className="text-lg text-wedding-gray leading-relaxed max-w-2xl mx-auto">
          Te pedimos que confirmes tu asistencia a nuestro matrimonio. Tu presencia significa mucho para nosotros.
        </p>
      </div>
      
      <LeafDivider />

      {/* Boletos Asignados */}
      {guest.numPersonas && (
        <div className="mb-10 mt-10 p-6 bg-gradient-to-r from-wedding-primary/10 to-wedding-rose/10 rounded-xl border-2 border-wedding-primary/30">
          <div className="text-center">
            <p className="text-wedding-gray text-sm uppercase tracking-widest font-semibold mb-2">Tu Asignación</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🍃</span>
              <p className="text-3xl font-bold text-wedding-primary">{guest.numPersonas} Boleto{guest.numPersonas !== 1 ? 's' : ''}</p>
              <span className="text-4xl">🍃</span>
            </div>
            <p className="text-wedding-gray text-sm mt-3">Para ti{guest.numPersonas > 1 ? ' y ' + (guest.numPersonas - 1) + ' acompañante' + (guest.numPersonas > 2 ? 's' : '') : ''}</p>
          </div>
        </div>
      )}

      {/* Attendance Selection */}
      <div className="mb-12 mt-10">
        <label className="block text-xl font-semibold text-wedding-primary mb-6 text-center">
          ¿Asistirás a nuestra boda?
        </label>
        
        <div className="space-y-3">
          <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
            attendance === 'yes' 
              ? 'border-wedding-primary bg-wedding-light' 
              : 'border-wedding-sand hover:border-wedding-primary'
          }`}>
            <input
              type="radio"
              name="attendance"
              value="yes"
              checked={attendance === 'yes'}
              onChange={(e) => setAttendance('yes')}
              className="w-5 h-5 cursor-pointer accent-wedding-primary"
            />
            <span className="ml-4 font-semibold text-wedding-primary">
              🎉 Sí, ¡estaré presente!
            </span>
          </label>

          <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
            attendance === 'no' 
              ? 'border-wedding-primary bg-wedding-light' 
              : 'border-wedding-sand hover:border-wedding-primary'
          }`}>
            <input
              type="radio"
              name="attendance"
              value="no"
              checked={attendance === 'no'}
              onChange={(e) => setAttendance('no')}
              className="w-5 h-5 cursor-pointer accent-wedding-primary"
            />
            <span className="ml-4 font-semibold text-wedding-primary">
              💔 Lamentablemente no podré asistir
            </span>
          </label>
        </div>
      </div>

      {/* Dietary Restrictions - Only show if attending */}
      {attendance === 'yes' && (
        <div className="mb-8 p-5 bg-wedding-light rounded-xl border-2 border-wedding-rose/30">
          <label htmlFor="dietary" className="block text-lg font-semibold text-wedding-primary mb-3">
            🍽️ Restricciones Dietéticas
          </label>
          <textarea
            id="dietary"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            placeholder="Ej: Vegetariano, Alergia a frutos secos, Vegano, etc."
            className="w-full px-4 py-3 border-2 border-wedding-sand rounded-lg focus:outline-none focus:border-wedding-primary focus:bg-white transition-all"
            rows={3}
          />
        </div>
      )}

      {/* Additional Comments */}
      <div className="mb-8">
        <label htmlFor="comments" className="block text-lg font-semibold text-wedding-primary mb-3">
          ✉️ Comentarios o Mensajes
        </label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Aquí puedes escribir tus mejores deseos, preguntas o comentarios especiales..."
          className="w-full px-4 py-3 border-2 border-wedding-sand rounded-lg focus:outline-none focus:border-wedding-primary focus:bg-white transition-all"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !attendance}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all text-lg ${
          loading || !attendance
            ? 'bg-wedding-sand cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-wedding-primary to-wedding-rose hover:shadow-lg hover:-translate-y-0.5'
        }`}
      >
        {loading ? '⏳ Enviando...' : '✓ Confirmar Asistencia'}
      </button>

      <p className="text-xs text-wedding-gray text-center mt-6 italic">
        Tus datos serán guardados de forma segura en nuestra base de datos.
      </p>
    </form>
  )
}
