import './HomePage.css'

const STEPS = [
  { step: '1', title: 'Upload', detail: 'Drop in a video of your swing, shot, kick, or throw.' },
  { step: '2', title: 'Detect', detail: 'Real pose detection tracks your body frame by frame, right in your browser.' },
  { step: '3', title: 'Get Feedback', detail: 'See checkpoints, real angles, and plain-language coaching tips.' },
]

export function HomePage({ sports, onSelectSport }) {
  return (
    <div className="home-page">
      <section className="home-intro">
        <h2 className="home-intro-title">Pick a sport to get started</h2>
        <p className="home-intro-detail">
          CoachCam runs real pose detection on your uploaded video — nothing leaves your browser — and turns it into
          frame-by-frame checkpoints and coaching feedback.
        </p>
      </section>

      <section className="home-steps">
        {STEPS.map((s) => (
          <div className="home-step" key={s.step}>
            <span className="home-step-number mono">{s.step}</span>
            <div>
              <h3 className="home-step-title">{s.title}</h3>
              <p className="home-step-detail">{s.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="home-sports">
        {sports.map((sport) => (
          <button type="button" key={sport.id} className="home-sport-card" onClick={() => onSelectSport(sport)}>
            <span className="home-sport-icon" aria-hidden="true">
              {sport.icon}
            </span>
            <span className="home-sport-label">{sport.label}</span>
            <span className="home-sport-blurb">{sport.blurb}</span>
          </button>
        ))}
      </section>
    </div>
  )
}
