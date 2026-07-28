import { formatDegrees } from '../lib/angles'
import './ResultsPanel.css'

export function ResultsPanel({
  status,
  progress,
  checkpoints,
  onAnalyze,
  onSelectTime,
  canAnalyze,
  checkpointDefs,
  title,
  analyzeLabel,
  activityLabel,
}) {
  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>{title}</h2>
        <button type="button" className="results-analyze-btn" onClick={onAnalyze} disabled={!canAnalyze || status === 'analyzing'}>
          {status === 'analyzing' ? `Analyzing… ${Math.round(progress * 100)}%` : analyzeLabel}
        </button>
      </div>

      <div className="results-grid">
        {checkpointDefs.map(({ key, label, metric, metricLabel }) => {
          const data = checkpoints?.[key]
          const value = data ? data[metric] : null
          return (
            <button
              type="button"
              key={key}
              className={`results-card ${data ? 'is-active' : ''}`}
              onClick={() => data && onSelectTime(data.time)}
              disabled={!data}
            >
              <span className="results-card-label">{label}</span>
              <span className="results-card-value mono">{formatDegrees(value)}</span>
              <span className="results-card-metric">{metricLabel}</span>
            </button>
          )
        })}
      </div>

      {status === 'idle' && !checkpoints && (
        <p className="results-empty">Upload a video and run analysis to populate checkpoints.</p>
      )}

      {status === 'no-match' && (
        <p className="results-empty results-no-match">
          We couldn't find a clear {activityLabel} in this video — try a well-lit clip with the person fully in
          frame, or check that you've uploaded a matching video for this tab.
        </p>
      )}
    </div>
  )
}
