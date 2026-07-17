'use client'

interface EventDetailsProps {
  date: Date
  location: string
  mapUrl: string
}

export default function EventDetails({ date, location, mapUrl }: EventDetailsProps) {
  // Obtener información de la fecha
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const monthName = new Date(year, month).toLocaleString('es-ES', { month: 'long' })
  const dayName = date.toLocaleString('es-ES', { weekday: 'long' })

  // Obtener el primer día del mes y días en el mes
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Ajustar para que lunes sea 0

  // Crear array de días para el calendario
  const calendarDays = []
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Sección Calendario */}
      <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 relative overflow-hidden">
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 text-3xl opacity-20">✿</div>
        <div className="absolute top-4 right-4 text-3xl opacity-20">✿</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-20">✿</div>
        <div className="absolute bottom-4 right-4 text-3xl opacity-20">✿</div>

        {/* Título con fecha resaltada */}
        <div className="text-center mb-10">
          <p className="text-sm text-wedding-gray uppercase tracking-widest font-semibold mb-3">
            La Gran Fecha
          </p>
          <p className="text-4xl md:text-5xl font-bold text-wedding-primary capitalize mb-2">
            {dayName}
          </p>
          <p className="text-2xl md:text-3xl text-wedding-sand font-light mb-6">
            {day} de {monthName} de {year}
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-6 my-6">
            <span className="text-wedding-primary opacity-50">🍃</span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent to-wedding-primary/30"></div>
            <span className="text-wedding-primary opacity-50">🍃</span>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-wedding-light rounded-xl p-6 mb-8">
          <h3 className="text-center font-bold text-wedding-primary mb-6 text-lg capitalize">
            {monthName} {year}
          </h3>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-wedding-primary py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayNum, index) => (
              <div
                key={index}
                className={`text-center py-3 rounded-lg font-semibold transition-all ${
                  dayNum === null
                    ? 'text-transparent'
                    : dayNum === day
                      ? 'bg-gradient-to-br from-wedding-primary to-wedding-rose text-white text-lg shadow-lg transform scale-110'
                      : 'text-wedding-gray hover:bg-wedding-primary/10'
                }`}
              >
                {dayNum}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección Mapa */}
      <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 relative overflow-hidden">
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 text-3xl opacity-20">✿</div>
        <div className="absolute top-4 right-4 text-3xl opacity-20">✿</div>

        {/* Título */}
        <div className="text-center mb-8">
          <p className="text-sm text-wedding-gray uppercase tracking-widest font-semibold mb-3">
            Ubicación del Evento
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-wedding-primary mb-6 capitalize">
            {location}
          </h3>

          {/* Divider */}
          <div className="flex items-center justify-center gap-6">
            <span className="text-wedding-primary opacity-50">🍃</span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent to-wedding-primary/30"></div>
            <span className="text-wedding-primary opacity-50">🍃</span>
          </div>
        </div>

        {/* Mapa */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d926.2370692384837!2d-99.56934526102714!3d20.42672112113486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d3bf6db665f48d%3A0x5937ae8748d69ed5!2sHacienda%20de%20Comodej%C3%A9!5e1!3m2!1sen!2smx!4v1784254052630!5m2!1sen!2smx"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Link al mapa */}
        <div className="text-center">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-wedding-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-wedding-rose hover:shadow-lg transition-all transform hover:scale-105"
          >
            🗺️ Ver en Google Maps
          </a>
        </div>
      </div>
    </div>
  )
}
