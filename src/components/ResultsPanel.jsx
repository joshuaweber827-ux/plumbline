import { formatDegrees } from '../lib/angles'
import './ResultsPanel.css'

const CHECKPOINTS = [
  { key: 'setup', label: 'Setup Posture', metric: 'spineTilt', metricLabel: 'Spine tilt' },
  { key: 'backswing', label: 'Backswing Plane', metric: 'swingPlane', metricLabel: 'Swing plane' },
  { key: 'top', label: 'Top of Swing', metric: 'spineTilt', metricLabel: 'Spine tilt' },
  { key: 'transition', label: 'Transition', metric: 'spineTilt', metricLabel: 'Spine tilt' },
  { key: 'impact', label: 'Impact', metric: 'spineTilt', metricLabel: 'Spine tilt' },
  { key: 'follow', label: 'Follow-Through', metric: 'spineTilt', metricLabel: 'Spine tilt' },
]

export function ResultsPanel({ status, progress, checkpoints, onAnalyze, onSelectTime, canAnalyze }) {
  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Swing Checkpoints</h2>
        <button type="button" className="results-analyze-btn" onClick={onAnalyze} disabled={!canAnalyze || status === 'analyzing'}>
          {status === 'analyzing' ? `Analyzing… ${Math.round(progress * 100)}%` : 'Analyze Swing'}
        </button>
      </div>

      <div className="results-grid">
        {CHECKPOINTS.map(({ key, label, metric, metricLabel }) => {
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
    </div>
  )
}
