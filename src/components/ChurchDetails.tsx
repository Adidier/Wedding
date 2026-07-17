'use client'

interface ChurchDetailsProps {
  churchName: string
  address: string
}

export default function ChurchDetails({ churchName, address }: ChurchDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 relative overflow-hidden">
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 text-3xl opacity-20">✿</div>
        <div className="absolute top-4 right-4 text-3xl opacity-20">✿</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-20">✿</div>
        <div className="absolute bottom-4 right-4 text-3xl opacity-20">✿</div>

        {/* Título */}
        <div className="text-center mb-10">
          <p className="text-sm text-wedding-gray uppercase tracking-widest font-semibold mb-3">
            Celebración Religiosa
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-wedding-primary mb-6 capitalize">
            {churchName}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1171000.9564085493!2d-100.1307081014627!3d19.831141926440626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d3bc22857be7eb%3A0x876e80fb79043b50!2sIglesia%20Del%20Se%C3%B1or%20de%20El%20Calvario!5e1!3m2!1sen!2smx!4v1784254642725!5m2!1sen!2smx"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Location Info */}
        <div className="border-t-2 border-wedding-light pt-6 text-center">
          <div className="flex items-center justify-center gap-3 text-lg text-wedding-primary font-semibold mb-3">
            <span>⛪</span>
            <span>{churchName}</span>
          </div>
          <p className="text-wedding-gray text-sm">{address}</p>
        </div>
      </div>
    </div>
  )
}
