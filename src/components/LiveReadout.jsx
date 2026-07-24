import { formatDegrees } from '../lib/angles'
import './LiveReadout.css'

export function LiveReadout({ spineTilt, swingPlane, detected }) {
  return (
    <div className="live-readout">
      <div className="live-readout-item">
        <span className="live-readout-label">Spine tilt</span>
        <span className="live-readout-value mono">{formatDegrees(spineTilt)}</span>
      </div>
      <div className="live-readout-item">
        <span className="live-readout-label">Wrist line</span>
        <span className="live-readout-value mono">{formatDegrees(swingPlane)}</span>
      </div>
      <div className={`live-readout-status ${detected ? 'is-live' : ''}`}>
        <span className="live-readout-dot" />
        {detected ? 'Pose detected' : 'No pose detected'}
      </div>
    </div>
  )
}
