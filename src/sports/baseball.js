import { analyzeAtBat } from '../lib/analyzeAtBat'
import { generateAtBatCoachingTips } from '../lib/baseballCoaching'
import { spineTiltAngle, elbowAngle } from '../lib/angles'

export const baseballSport = {
  id: 'baseball',
  label: 'Baseball',
  icon: '⚾',
  tagline: 'Real pose-detection swing analysis, right in your browser',
  blurb: 'Torso separation, extension, and balance on your swing.',
  activityLabel: 'swing',
  analyzeLabel: 'Analyze Swing',
  checkpointsTitle: 'Swing Checkpoints',
  feedbackTitle: 'Swing Feedback',
  analyze: analyzeAtBat,
  coach: generateAtBatCoachingTips,
  liveMetrics: [
    { key: 'spineTilt', label: 'Body lean', compute: spineTiltAngle },
    { key: 'elbow', label: 'Elbow angle', compute: elbowAngle },
  ],
  checkpointDefs: [
    { key: 'stance', label: 'Stance', metric: 'spineTilt', metricLabel: 'Body lean' },
    { key: 'load', label: 'Load', metric: 'separation', metricLabel: 'Torso separation' },
    { key: 'stride', label: 'Stride', metric: 'kneeBend', metricLabel: 'Front knee bend' },
    { key: 'contact', label: 'Contact', metric: 'elbow', metricLabel: 'Arm extension' },
    { key: 'extension', label: 'Extension', metric: 'elbow', metricLabel: 'Arm extension' },
    { key: 'finish', label: 'Finish', metric: 'spineTilt', metricLabel: 'Body lean' },
  ],
}
