import './CoachingPanel.css'

export function CoachingPanel({ checkpoints, tipGenerator, title }) {
  if (!checkpoints) return null
  const tips = tipGenerator(checkpoints)

  return (
    <div className="coaching-panel">
      <h2>{title}</h2>
      <div className="coaching-list">
        {tips.map((tip) => (
          <div key={tip.id} className={`coaching-tip coaching-tip-${tip.severity}`}>
            <span className="coaching-tip-title">{tip.title}</span>
            <p className="coaching-tip-detail">{tip.detail}</p>
          </div>
        ))}
      </div>
      <p className="coaching-disclaimer">
        These tips come from tracking your movement on video — a helpful starting point, not a replacement for a coach.
      </p>
    </div>
  )
}
