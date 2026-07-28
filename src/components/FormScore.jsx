import './FormScore.css'

export function FormScore({ result, activityLabel }) {
  if (!result) return null
  const { score, total } = result
  const tier = score >= 70 ? 'good' : 'watch'

  return (
    <div className={`form-score form-score-${tier}`}>
      <div className="form-score-value mono">
        {score}
        <span className="form-score-max">/100</span>
      </div>
      <div className="form-score-body">
        <span className="form-score-label">Form Score</span>
        <span className="form-score-detail">
          How close this {activityLabel} measures to ideal form, averaged across {total} checks
        </span>
      </div>
    </div>
  )
}
