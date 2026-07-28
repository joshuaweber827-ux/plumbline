import './SportIllustration.css'

const ICONS = {
  golf: (
    <svg viewBox="0 0 200 200" className="sport-illustration-svg" aria-hidden="true">
      <ellipse cx="100" cy="176" rx="72" ry="9" className="si-ground" />
      <line x1="130" y1="176" x2="130" y2="36" className="si-line-thick" />
      <path d="M130 36 L184 56 L130 76 Z" className="si-fill" />
      <circle cx="58" cy="150" r="9" className="si-ball" />
    </svg>
  ),
  basketball: (
    <svg viewBox="0 0 200 200" className="sport-illustration-svg" aria-hidden="true">
      <circle cx="100" cy="100" r="72" className="si-outline si-fill-bg" />
      <line x1="100" y1="28" x2="100" y2="172" className="si-line" />
      <line x1="28" y1="100" x2="172" y2="100" className="si-line" />
      <path d="M35 52 Q102 100 35 148" className="si-line si-noFill" />
      <path d="M165 52 Q98 100 165 148" className="si-line si-noFill" />
    </svg>
  ),
  baseball: (
    <svg viewBox="0 0 200 200" className="sport-illustration-svg" aria-hidden="true">
      <line x1="18" y1="182" x2="148" y2="34" className="si-line-thick" />
      <circle cx="132" cy="72" r="44" className="si-outline si-fill-bg" />
      <path d="M100 40 Q124 72 100 104" className="si-line si-noFill" />
      <path d="M164 40 Q140 72 164 104" className="si-line si-noFill" />
    </svg>
  ),
  soccer: (
    <svg viewBox="0 0 200 200" className="sport-illustration-svg" aria-hidden="true">
      <circle cx="100" cy="100" r="72" className="si-outline si-fill-bg" />
      <polygon points="100,68 122,84 114,110 86,110 78,84" className="si-fill" />
      <line x1="100" y1="68" x2="100" y2="42" className="si-line-thin" />
      <line x1="122" y1="84" x2="148" y2="68" className="si-line-thin" />
      <line x1="114" y1="110" x2="130" y2="138" className="si-line-thin" />
      <line x1="86" y1="110" x2="70" y2="138" className="si-line-thin" />
      <line x1="78" y1="84" x2="52" y2="68" className="si-line-thin" />
    </svg>
  ),
  football: (
    <svg viewBox="0 0 200 200" className="sport-illustration-svg" aria-hidden="true">
      <g transform="rotate(-24 100 100)">
        <ellipse cx="100" cy="100" rx="82" ry="44" className="si-outline si-fill-bg" />
        <line x1="66" y1="100" x2="134" y2="100" className="si-line" />
        <line x1="80" y1="91" x2="80" y2="109" className="si-line-thin" />
        <line x1="92" y1="91" x2="92" y2="109" className="si-line-thin" />
        <line x1="108" y1="91" x2="108" y2="109" className="si-line-thin" />
        <line x1="120" y1="91" x2="120" y2="109" className="si-line-thin" />
      </g>
    </svg>
  ),
}

export function SportIllustration({ sport }) {
  const icon = ICONS[sport.id]
  if (!icon) return null

  return (
    <div className="sport-illustration">
      {icon}
      <p className="sport-illustration-caption">
        Upload a video above to see real pose tracking on your {sport.activityLabel}.
      </p>
    </div>
  )
}
