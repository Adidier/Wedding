export function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-wedding-primary to-transparent"></div>
      <div className="text-wedding-primary text-2xl">✿</div>
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-wedding-primary to-transparent"></div>
    </div>
  )
}

export function MonogramBox({ initials, style = 'oval' }: { initials: string; style?: 'oval' | 'diamond' | 'simple' }) {
  if (style === 'oval') {
    return (
      <div className="inline-block">
        <svg width="120" height="140" viewBox="0 0 120 140" className="drop-shadow-lg">
          {/* Oval outline */}
          <ellipse cx="60" cy="70" rx="50" ry="65" fill="none" stroke="#B42150" strokeWidth="2" />
          
          {/* Decorative elements */}
          <path d="M 30 60 Q 40 50 60 50 Q 80 50 90 60" fill="none" stroke="#F9B2A0" strokeWidth="1.5" opacity="0.6" />
          <path d="M 30 80 Q 40 90 60 90 Q 80 90 90 80" fill="none" stroke="#F9B2A0" strokeWidth="1.5" opacity="0.6" />
          
          {/* Text */}
          <text x="60" y="75" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#B42150" fontFamily="serif">
            {initials}
          </text>
        </svg>
      </div>
    )
  }

  if (style === 'diamond') {
    return (
      <div className="inline-block">
        <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-lg">
          {/* Diamond shape */}
          <path d="M 70 10 L 130 70 L 70 130 L 10 70 Z" fill="none" stroke="#B42150" strokeWidth="2" />
          
          {/* Decorative corners */}
          <circle cx="70" cy="20" r="3" fill="#F9B2A0" />
          <circle cx="120" cy="70" r="3" fill="#F9B2A0" />
          <circle cx="70" cy="120" r="3" fill="#F9B2A0" />
          <circle cx="20" cy="70" r="3" fill="#F9B2A0" />
          
          {/* Text */}
          <text x="70" y="80" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#B42150" fontFamily="serif">
            {initials}
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className="inline-block text-center">
      <div className="text-5xl font-bold text-wedding-primary font-serif">{initials}</div>
    </div>
  )
}

export function FloralCorner({ position = 'top-left' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }

  const rotations = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-left': '-rotate-90',
    'bottom-right': 'rotate-180',
  }

  return (
    <div className={`absolute ${positions[position]} ${rotations[position]} opacity-10 pointer-events-none`}>
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#B42150" strokeWidth="1">
        <path d="M 10 50 Q 30 30 50 20 Q 70 30 90 50" />
        <path d="M 10 50 Q 30 70 50 80 Q 70 70 90 50" />
        <circle cx="20" cy="40" r="3" fill="#B42150" />
        <circle cx="80" cy="40" r="3" fill="#B42150" />
        <circle cx="50" cy="15" r="2.5" fill="#B42150" />
      </svg>
    </div>
  )
}

export function FlowerAccent() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="inline-block opacity-60">
      {/* Petals */}
      <circle cx="30" cy="10" r="6" fill="#F9B2A0" />
      <circle cx="45" cy="18" r="6" fill="#F9B2A0" />
      <circle cx="50" cy="30" r="6" fill="#F9B2A0" />
      <circle cx="45" cy="42" r="6" fill="#F9B2A0" />
      <circle cx="30" cy="50" r="6" fill="#F9B2A0" />
      <circle cx="15" cy="42" r="6" fill="#F9B2A0" />
      <circle cx="10" cy="30" r="6" fill="#F9B2A0" />
      <circle cx="15" cy="18" r="6" fill="#F9B2A0" />
      {/* Center */}
      <circle cx="30" cy="30" r="8" fill="#B42150" />
    </svg>
  )
}

export function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-6 my-6">
      <span className="text-wedding-primary opacity-50">🍃</span>
      <div className="flex-grow h-px bg-gradient-to-r from-transparent to-wedding-primary/30"></div>
      <span className="text-wedding-primary opacity-50">🍃</span>
    </div>
  )
}
