import { generateCoachingTips } from '../lib/coaching'
import './CoachingPanel.css'

export function CoachingPanel({ checkpoints }) {
  if (!checkpoints) return null
  const tips = generateCoachingTips(checkpoints)

  return (
    <div className="coaching-panel">
      <h2>Swing Feedback</h2>
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
