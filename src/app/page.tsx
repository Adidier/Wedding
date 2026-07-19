import type { Metadata } from 'next'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FloralDivider, MonogramBox, FlowerAccent, LeafDivider } from '@/components/Decorations'
import GuestSearch from '@/components/GuestSearch'
import ConfirmButton from '@/components/ConfirmButton'
import EventDetails from '@/components/EventDetails'
import ChurchDetails from '@/components/ChurchDetails'
import GroupPreview from '@/components/GroupPreview'

export const metadata: Metadata = {
  title: 'Bienvenido - Confirmación de Asistencia',
  description: 'Confirma tu asistencia a nuestra boda',
}

// Force dynamic rendering to avoid prerender errors for client hooks
export const dynamic = 'force-dynamic'

export default function Home() {
  const weddingDate = new Date(process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-11-07')
  const formattedDate = format(weddingDate, "d 'de' MMMM 'de' yyyy", { locale: es })
  const dayName = format(weddingDate, 'EEEE', { locale: es })
  const rsvpDeadline = new Date('2026-09-20')
  const formattedDeadline = format(rsvpDeadline, "d 'de' MMMM", { locale: es })

  return (
    <main className="min-h-screen bg-wedding-light">
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>

      <div className="container mx-auto px-4 py-12 md:py-24">
        {/* Main Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="text-wedding-accent font-semibold tracking-widest uppercase text-sm bg-wedding-rose/30 px-4 py-2 rounded-full">
              ✨ Te Invitamos A Celebrar ✨
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            ¡Nuestra Boda!
          </h1>
          
          {/* Monogram */}
          <div className="flex justify-center mb-8">
            <div className="opacity-80">
              <MonogramBox initials="&" style="diamond" />
            </div>
          </div>
        </div>

        {/* Guest Search */}
        <GuestSearch />

        {/* If token present in URL, show a preview of group members */}
        <GroupPreview />

        {/* Frases Personalizadas */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-l-4 border-wedding-primary relative">
            {/* Decorative flowers */}
            <div className="absolute -top-4 -right-4 opacity-30">
              <FlowerAccent />
            </div>
            
            <p className="text-lg text-wedding-gray italic mb-6 leading-relaxed">
              "Nuestro viaje apenas comienza. Queremos compartir contigo uno de los días más importantes de nuestras vidas."
            </p>
            <p className="text-lg text-wedding-gray italic mb-6 leading-relaxed">
              "Ante Dios y rodeados de quienes más queremos, uniremos nuestras vidas en el sacramento del matrimonio."
            </p>
            <p className="text-lg text-wedding-primary font-semibold">
              "Personas muy importantes para nosotros que hoy nos acompañan en este día tan especial."
            </p>
          </div>
        </div>

        <FloralDivider />

        {/* Wedding Date and Location Card */}
        <div className="mb-16">
          <EventDetails 
            date={weddingDate}
            location="Hacienda de Comodejé"
            mapUrl="https://maps.app.goo.gl/vZdCR8rRrzjf2VTp9"
          />
        </div>

        <FloralDivider />

        {/* Church Ceremony Card */}
        <div className="mb-16">
          <ChurchDetails
            churchName="Iglesia Del Señor de El Calvario"
            address="Ubicación de la iglesia para la celebración religiosa"
          />
        </div>

        <FloralDivider />

        {/* Call to Action - RSVP */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-wedding-primary via-wedding-rose to-wedding-accent rounded-2xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20 text-6xl">💐</div>
            <div className="absolute bottom-0 left-0 opacity-10 text-6xl">✿</div>
            <div className="relative z-10">
              <p className="text-3xl font-bold mb-4">¡Nos encantaría que nos acompañes!</p>
              <p className="text-lg opacity-95 mb-8 leading-relaxed">
                Por favor, confirma tu asistencia usando el enlace personalizado que recibiste en tu invitación. Nos gustaría conocer tus restricciones dietéticas y poder abrir espacio para ti.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Confirm button uses client component to preserve token in querystring when present */}
                    <ConfirmButton />
                    <div className="hidden sm:block text-2xl opacity-50">→</div>
                    <div className="bg-white/20 backdrop-blur text-white px-6 py-4 rounded-full font-semibold text-base">
                      ⏰ Antes del 19 de septiembre
                    </div>
                  </div>
            </div>
          </div>
        </div>

        <FloralDivider />

        {/* Información Importante - Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-wedding-primary mb-8 text-center">📋 Información Importante</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Invitación */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-primary">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                🎟️ Invitación Personal
              </h3>
              <p className="text-wedding-gray text-sm">
                Acceso únicamente con invitación y confirmación previa.
              </p>
            </div>

            {/* Fecha Límite */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-rose">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                📅 Fecha Límite RSVP
              </h3>
              <p className="text-wedding-gray text-sm">
                Confirma tu asistencia a más tardar el <strong>20 de septiembre</strong> mediante el formulario. Recibirás un código de confirmación.
              </p>
            </div>

            {/* Vestimenta */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-accent">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                👔 Vestimenta Formal
              </h3>
              <p className="text-wedding-gray text-sm">
                Se requiere vestimenta formal. <strong>Evitar color blanco en damas.</strong>
              </p>
            </div>

            {/* Puntualidad */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-primary">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                ⏰ Puntualidad
              </h3>
              <p className="text-wedding-gray text-sm">
                Te pedimos llegar con anticipación para iniciar puntualmente la ceremonia.
              </p>
            </div>

            {/* Celulares */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-rose">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                📱 Celulares
              </h3>
              <p className="text-wedding-gray text-sm">
                Se permite el uso de celulares, pero te pedimos mantenerlos en <strong>silencio durante la ceremonia.</strong>
              </p>
            </div>

            {/* Alcohol */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-accent">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                🍾 Bebidas Alcohólicas
              </h3>
              <p className="text-wedding-gray text-sm">
                No habrá servicio de alcohol. Si traes tu bebida, te pedimos disfrutarla con <strong>moderación.</strong>
              </p>
            </div>

            {/* Mascotas */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-primary">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                🐾 Mascotas
              </h3>
              <p className="text-wedding-gray text-sm">
                Por disposiciones de la hacienda, <strong>no se permiten mascotas.</strong>
              </p>
            </div>

            {/* Transporte */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-rose">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                🚗 Transporte
              </h3>
              <p className="text-wedding-gray text-sm">
                La iglesia y el salón están a distancia considerable. Recomendamos transporte particular.
              </p>
            </div>

            {/* Estacionamiento */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-accent">
              <h3 className="font-bold text-wedding-primary mb-3 flex items-center gap-2">
                🅿️ Estacionamiento
              </h3>
              <p className="text-wedding-gray text-sm">
                Te agradecemos seguir las indicaciones del personal y extremar precaución en el acceso principal.
              </p>
            </div>
          </div>
        </div>

        {/* Mesa de Regalos */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-wedding-sand/20 to-wedding-rose/20 rounded-2xl p-8 border-2 border-wedding-primary/30">
            <h3 className="text-2xl font-bold text-wedding-primary mb-4 flex items-center gap-2">
              🎁 Mesa de Regalos
            </h3>
            <p className="text-wedding-gray mb-4">
              Si deseas obsequiarnos algo, nos será de gran ayuda tu apoyo para nuestro nuevo proyecto de vida.
            </p>
            <p className="text-wedding-primary font-semibold">
              Contáctanos para más información sobre cómo colaborar.
            </p>
          </div>
        </div>

        {/* Duración del Evento */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-wedding-primary">
            <p className="text-lg text-wedding-gray">
              <span className="font-bold text-wedding-primary">⏱️ Duración del Evento:</span> El evento finalizará aproximadamente a la 1:00 AM
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-wedding-primary mb-6 text-center">🗺️ Navega por nuestro sitio</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="/lugares"
              className="group bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-primary hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-wedding-primary text-lg mb-2 group-hover:text-wedding-rose transition-colors">
                Lugares de Celebración
              </h3>
              <p className="text-wedding-gray text-sm">
                Información sobre la iglesia, el salón y transporte
              </p>
            </a>

            <a
              href="/dudas"
              className="group bg-white rounded-xl p-6 shadow-lg border-t-4 border-wedding-accent hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">❓</div>
              <h3 className="font-bold text-wedding-primary text-lg mb-2 group-hover:text-wedding-rose transition-colors">
                Preguntas Frecuentes
              </h3>
              <p className="text-wedding-gray text-sm">
                Resolvemos tus dudas sobre la boda
              </p>
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-wedding-gray text-sm italic mb-4">
            Si tienes dudas o preguntas, contáctanos a través del email incluido en tu invitación.
          </p>
          <div className="inline-block bg-wedding-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-wedding-primary/90 transition-all cursor-pointer">
            ✉️ Contáctanos
          </div>
        </div>
      </div>
    </main>
  )
}
