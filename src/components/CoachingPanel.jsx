import './CoachingPanel.css'

export function CoachingPanel({ tips, title }) {
  if (!tips || tips.length === 0) return null

  const goodTips = tips.filter((tip) => tip.severity === 'good')
  const watchTips = tips.filter((tip) => tip.severity === 'watch')
  const infoTips = tips.filter((tip) => tip.severity === 'info')

  return (
    <div className="coaching-panel">
      <h2>{title}</h2>

      {infoTips.length > 0 && (
        <div className="coaching-list">
          {infoTips.map((tip) => (
            <div key={tip.id} className="coaching-tip coaching-tip-info">
              <span className="coaching-tip-title">{tip.title}</span>
              <p className="coaching-tip-detail">{tip.detail}</p>
            </div>
          ))}
        </div>
      )}

      {(goodTips.length > 0 || watchTips.length > 0) && (
        <div className="coaching-columns">
          {goodTips.length > 0 && (
            <div className="coaching-column">
              <h3 className="coaching-column-title coaching-column-title-good">What's Working</h3>
              <div className="coaching-list">
                {goodTips.map((tip) => (
                  <div key={tip.id} className="coaching-tip coaching-tip-good">
                    <span className="coaching-tip-title">{tip.title}</span>
                    <p className="coaching-tip-detail">{tip.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {watchTips.length > 0 && (
            <div className="coaching-column">
              <h3 className="coaching-column-title coaching-column-title-watch">Focus On This</h3>
              <div className="coaching-list">
                {watchTips.map((tip) => (
                  <div key={tip.id} className="coaching-tip coaching-tip-watch">
                    <span className="coaching-tip-title">{tip.title}</span>
                    <p className="coaching-tip-detail">{tip.detail}</p>
                    {tip.betterForm && (
                      <p className="coaching-tip-example">
                        <span className="coaching-tip-example-label">What better form looks like</span>
                        {tip.betterForm}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="coaching-disclaimer">
        These tips come from tracking your movement on video — a helpful starting point, not a replacement for a coach.
      </p>
    </div>
  )
}
