import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lugares - Nuestra Boda',
  description: 'Información sobre los lugares de celebración',
}

export default function LugaresPage() {
  return (
    <main className="min-h-screen bg-wedding-light py-12">
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Lugares de Celebración</h1>
          <p className="text-wedding-light text-lg">Toda la información que necesitas</p>
        </div>

        {/* Timeline */}
        <div className="relative mb-16">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-wedding-primary to-wedding-rose"></div>

          {/* Event 1 - Ceremonia Religiosa */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="w-5/12 text-right pr-8">
                <div className="bg-white rounded-xl p-8 shadow-lg border-r-4 border-wedding-primary">
                  <h2 className="text-2xl font-bold text-wedding-primary mb-2">Ceremonia Religiosa</h2>
                  <div className="space-y-3 text-wedding-gray">
                    <div className="flex items-center justify-end gap-2">
                      <span>🕐</span>
                      <span className="font-semibold">14:00 (2:00 PM)</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span>📍</span>
                      <span className="font-semibold">Iglesia del Señor del Cal</span>
                    </div>
                    <p className="text-sm italic mt-4">
                      Te esperamos con anticipación para una ceremonia inolvidable ante Dios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="w-2/12 flex justify-center">
                <div className="w-12 h-12 bg-wedding-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg border-4 border-wedding-light">
                  🙏
                </div>
              </div>

              {/* Empty Space */}
              <div className="w-5/12"></div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center mb-8">
            <div className="text-wedding-primary text-3xl animate-bounce">⬇️</div>
          </div>

          {/* Event 2 - Recepción */}
          <div>
            <div className="flex items-center justify-between">
              {/* Empty Space */}
              <div className="w-5/12"></div>

              {/* Timeline Dot */}
              <div className="w-2/12 flex justify-center">
                <div className="w-12 h-12 bg-wedding-rose text-white rounded-full flex items-center justify-center font-bold shadow-lg border-4 border-wedding-light">
                  🎉
                </div>
              </div>

              {/* Content */}
              <div className="w-5/12 text-left pl-8">
                <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-wedding-rose">
                  <h2 className="text-2xl font-bold text-wedding-primary mb-2">Recepción y Fiesta</h2>
                  <div className="space-y-3 text-wedding-gray">
                    <div className="flex items-center gap-2">
                      <span>🕑</span>
                      <span className="font-semibold">16:00 (4:00 PM)</span>
                    </div>

                    <p className="text-sm italic mt-4">
                      Celebremos juntos con comida, música y diversión hasta aproximadamente la 1:00 AM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Iglesia del Señor del Cal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-primary">
            <h3 className="text-2xl font-bold text-wedding-primary mb-6 flex items-center gap-2">
              🙏 Iglesia del Señor del Cal
            </h3>
            
            <div className="space-y-4 text-wedding-gray">
              <div>
                <p className="font-bold text-wedding-primary mb-1">📍 Ubicación</p>
                <p className="text-sm">Calle Principal s/n, Madrid</p>
              </div>

              <div>
                <p className="font-bold text-wedding-primary mb-1">🕐 Horario</p>
                <p className="text-sm">14:00 (2:00 PM)</p>
              </div>

              <div>
                <p className="font-bold text-wedding-primary mb-1">ℹ️ Detalles</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>Ceremonia religiosa ante Dios</li>
                  <li>Duración aproximada: 30-40 minutos</li>
                  <li>Acceso únicamente para invitados confirmados</li>
                  <li>Foto oficial después de la ceremonia</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-wedding-primary mb-1">⚠️ Recuerda</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>Llega con anticipación</li>
                  <li>Vestimenta formal</li>
                  <li>Celular en silencio</li>
                  <li>Se permiten fotos con moderación</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hacienda de Comodejé */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-wedding-rose">
            <h3 className="text-2xl font-bold text-wedding-primary mb-6 flex items-center gap-2">
            </h3>
            
            <div className="space-y-4 text-wedding-gray">


              <div>
                <p className="font-bold text-wedding-primary mb-1">🕐 Horario</p>
                <p className="text-sm">16:00 (4:00 PM) - 01:00 (1:00 AM)</p>
              </div>

              <div>
                <p className="font-bold text-wedding-primary mb-1">🎊 Incluye</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>Cena gourmet</li>
                  <li>Música en vivo y DJ</li>
                  <li>Pista de baile</li>
                  <li>Barra de bebidas</li>
                  <li>Área de descanso</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-wedding-primary mb-1">💡 Información</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>Estacionamiento disponible</li>
                  <li>Accesibilidad para personas con movilidad reducida</li>
                  <li>Se permiten fotos libremente</li>
                  <li>Ambiente familiar y festivo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Distance Information */}
        <div className="bg-gradient-to-r from-wedding-sand/20 to-wedding-rose/20 rounded-2xl p-8 border-2 border-wedding-primary/30 mb-16">
          <h3 className="text-xl font-bold text-wedding-primary mb-4 flex items-center gap-2">
            🚗 Información de Transporte
          </h3>
          <p className="text-wedding-gray mb-4">
            La iglesia y el salón están a una distancia considerable. La duración aproximada entre ambos lugares es de <strong>15-20 minutos</strong> en transporte particular.
          </p>
          <ul className="space-y-3 text-wedding-gray">
            <li className="flex items-start gap-3">
              <span>✓</span>
              <span><strong>Recomendación:</strong> Organiza tu propio transporte o coordina con otros invitados</span>
            </li>
            <li className="flex items-start gap-3">
              <span>✓</span>
              <span><strong>Estacionamiento:</strong> Disponible en ambos lugares. Sigue las indicaciones del personal.</span>
            </li>
            <li className="flex items-start gap-3">
              <span>✓</span>
              <span><strong>Tráfico:</strong> Considera el tráfico en hora de tarde. Llega con tiempo de sobra.</span>
            </li>
          </ul>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-wedding-primary mb-6 text-center">📍 Ubicación en Mapa</h3>
          <p className="text-center text-wedding-gray mb-6">
            Pronto compartiremos los enlaces de Google Maps para ambos lugares. Puedes guardar estas direcciones en tu teléfono.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-wedding-light rounded-lg p-4 text-center">
              <p className="font-bold text-wedding-primary mb-2">🙏 Iglesia del Señor del Cal</p>
              <button className="text-wedding-primary font-semibold hover:underline">
                Abrir en Google Maps →
              </button>
            </div>
            <div className="bg-wedding-light rounded-lg p-4 text-center">
              <p className="font-bold text-wedding-primary mb-2">🎉 Hacienda de Comodejé</p>
              <a
                href="https://www.google.com/maps/place/Hacienda+de+Comodej%C3%A9/@20.4272304,-99.566732,1182m/data=!3m2!1e3!4b1!4m6!3m5!1s0x85d3bf6db665f48d:0x5937ae8748d69ed5!8m2!3d20.4272304!4d-99.566732!16s%2Fg%2F11js56fmk5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wedding-primary font-semibold hover:underline"
              >
                Abrir en Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-block bg-wedding-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-wedding-primary/90 transition-all text-center"
          >
            ← Volver a Inicio
          </a>
          <a
            href="/dudas"
            className="inline-block bg-wedding-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-wedding-accent/90 transition-all text-center"
          >
            Ver Preguntas Frecuentes →
          </a>
        </div>
      </div>
    </main>
  )
}
