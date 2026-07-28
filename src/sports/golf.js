import { analyzeSwing } from '../lib/analyzeSwing'
import { generateCoachingTips } from '../lib/coaching'
import { spineTiltAngle, wristLineAngle } from '../lib/angles'

export const golfSport = {
  id: 'golf',
  label: 'Golf',
  icon: '⛳',
  tagline: 'Real pose-detection swing analysis, right in your browser',
  blurb: 'Swing plane, tempo, and posture from real pose tracking.',
  activityLabel: 'swing',
  analyzeLabel: 'Analyze Swing',
  checkpointsTitle: 'Swing Checkpoints',
  feedbackTitle: 'Swing Feedback',
  analyze: analyzeSwing,
  coach: generateCoachingTips,
  liveMetrics: [
    { key: 'spineTilt', label: 'Spine tilt', compute: spineTiltAngle },
    { key: 'swingPlane', label: 'Wrist line', compute: wristLineAngle },
  ],
  checkpointDefs: [
    { key: 'setup', label: 'Setup Posture', metric: 'spineTilt', metricLabel: 'Spine tilt' },
    { key: 'backswing', label: 'Backswing Plane', metric: 'swingPlane', metricLabel: 'Swing plane' },
    { key: 'top', label: 'Top of Swing', metric: 'spineTilt', metricLabel: 'Spine tilt' },
    { key: 'transition', label: 'Transition', metric: 'spineTilt', metricLabel: 'Spine tilt' },
    { key: 'impact', label: 'Impact', metric: 'spineTilt', metricLabel: 'Spine tilt' },
    { key: 'follow', label: 'Follow-Through', metric: 'spineTilt', metricLabel: 'Spine tilt' },
  ],
}
