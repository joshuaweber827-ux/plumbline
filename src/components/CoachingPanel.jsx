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
        Estimates from single-camera pose detection — directional feedback, not a substitute for an in-person lesson.
      </p>
    </div>
  )
}
