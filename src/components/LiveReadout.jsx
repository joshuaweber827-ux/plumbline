import { formatDegrees } from '../lib/angles'
import './LiveReadout.css'

export function LiveReadout({ metrics, detected }) {
  return (
    <div className="live-readout">
      {metrics.map((metric) => (
        <div className="live-readout-item" key={metric.label}>
          <span className="live-readout-label">{metric.label}</span>
          <span className="live-readout-value mono">{formatDegrees(metric.value)}</span>
        </div>
      ))}
      <div className={`live-readout-status ${detected ? 'is-live' : ''}`}>
        <span className="live-readout-dot" />
        {detected ? 'Pose detected' : 'No pose detected'}
      </div>
    </div>
  )
}
