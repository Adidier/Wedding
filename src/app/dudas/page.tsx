import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes - Nuestra Boda',
  description: 'Respuestas a tus preguntas sobre la boda',
}

export default function DudasPage() {
  const faqs = [
    {
      question: '¿Puedo asistir sin confirmación previa?',
      answer: 'No, el acceso es únicamente con invitación y confirmación previa. Esto nos ayuda a organizar mejor el evento.',
    },
    {
      question: '¿Hasta cuándo puedo confirmar?',
      answer: 'La fecha límite para confirmar es el 20 de septiembre. Luego de esa fecha, no podremos garantizar tu lugar.',
    },
    {
      question: '¿Hay código de vestimenta?',
      answer: 'Sí, la vestimenta es formal. Damas: evitar color blanco. Caballeros: traje oscuro recomendado.',
    },
    {
      question: '¿A qué hora debo llegar?',
      answer: 'Te pedimos llegar con anticipación para iniciar puntualmente la ceremonia. Llega con tiempo de sobra.',
    },
    {
      question: '¿Puedo usar mi celular durante la ceremonia?',
      answer: 'Se permite el uso de celulares, pero te pedimos mantenerlos en silencio durante la ceremonia.',
    },
    {
      question: '¿Habrá alcohol en el evento?',
      answer: 'No habrá servicio de alcohol. Si deseas traer bebida, te pedimos disfrutarla con moderación.',
    },
    {
      question: '¿Puedo llevar a mi mascota?',
      answer: 'Por disposiciones de la hacienda, desafortunadamente no se permiten mascotas.',
    },
    {
      question: '¿Cómo llego al lugar?',
      answer: 'La iglesia y el salón están a distancia considerable. Recomendamos transporte particular. Siguue las indicaciones del personal de estacionamiento.',
    },
    {
      question: '¿Hay transporte disponible?',
      answer: 'Te recomendamos organizar tu propio transporte. La distancia es considerable.',
    },
    {
      question: '¿Puedo hacer preguntas adicionales?',
      answer: 'Claro, contáctanos a través del email incluido en tu invitación. Responderemos tus dudas con gusto.',
    },
    {
      question: '¿Cómo es el sistema de regalos?',
      answer: 'Si deseas obsequiarnos algo, nos será de gran ayuda tu apoyo para nuestro nuevo proyecto de vida. Contáctanos para más detalles.',
    },
    {
      question: '¿A qué hora finaliza el evento?',
      answer: 'El evento finalizará aproximadamente a la 1:00 AM.',
    },
  ]

  return (
    <main className="min-h-screen bg-wedding-light py-12">
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-wedding-primary to-wedding-primary/80 -z-10"></div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Preguntas Frecuentes</h1>
          <p className="text-wedding-light text-lg">Resolvemos tus dudas</p>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-wedding-primary hover:shadow-xl transition-all"
            >
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between bg-gradient-to-r from-wedding-light to-white hover:from-wedding-primary/10 hover:to-wedding-light transition-colors">
                <h3 className="font-bold text-wedding-primary text-lg">{faq.question}</h3>
                <span className="text-2xl text-wedding-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-wedding-light/50 border-t border-wedding-sand">
                <p className="text-wedding-gray leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-wedding-primary to-wedding-rose rounded-2xl p-8 text-white text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-4">¿Tu duda no está aquí?</h2>
          <p className="mb-6 opacity-95">
            Contáctanos directamente a través del email incluido en tu invitación. Estaremos felices de ayudarte.
          </p>
          <button className="bg-white text-wedding-primary font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1">
            ✉️ Enviar un Mensaje
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block bg-wedding-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-wedding-primary/90 transition-all"
          >
            ← Volver a la página principal
          </a>
        </div>
      </div>
    </main>
  )
}
