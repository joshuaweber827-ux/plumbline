import { analyzeThrow } from '../lib/analyzeThrow'
import { generateThrowCoachingTips } from '../lib/footballCoaching'
import { spineTiltAngle, elbowAngle } from '../lib/angles'

export const footballSport = {
  id: 'football',
  label: 'Football',
  icon: '🏈',
  tagline: 'Real pose-detection throwing form analysis, right in your browser',
  blurb: 'Arm mechanics, knee drive, and balance on your throw.',
  activityLabel: 'throw',
  analyzeLabel: 'Analyze Throw',
  checkpointsTitle: 'Throw Checkpoints',
  feedbackTitle: 'Throw Feedback',
  analyze: analyzeThrow,
  coach: generateThrowCoachingTips,
  liveMetrics: [
    { key: 'spineTilt', label: 'Body lean', compute: spineTiltAngle },
    { key: 'elbow', label: 'Elbow angle', compute: elbowAngle },
  ],
  checkpointDefs: [
    { key: 'stance', label: 'Stance', metric: 'spineTilt', metricLabel: 'Body lean' },
    { key: 'load', label: 'Load', metric: 'elbow', metricLabel: 'Elbow angle' },
    { key: 'stride', label: 'Stride', metric: 'kneeBend', metricLabel: 'Front knee bend' },
    { key: 'release', label: 'Release', metric: 'elbow', metricLabel: 'Elbow angle' },
    { key: 'followThrough', label: 'Follow-Through', metric: 'spineTilt', metricLabel: 'Body lean' },
    { key: 'finish', label: 'Finish', metric: 'spineTilt', metricLabel: 'Body lean' },
  ],
}
