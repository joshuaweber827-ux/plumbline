import { analyzeShot } from '../lib/analyzeShot'
import { generateShotCoachingTips } from '../lib/basketballCoaching'
import { spineTiltAngle, elbowAngle } from '../lib/angles'

export const basketballSport = {
  id: 'basketball',
  label: 'Basketball',
  icon: '🏀',
  tagline: 'Real pose-detection shooting form analysis, right in your browser',
  activityLabel: 'shot',
  analyzeLabel: 'Analyze Shot',
  checkpointsTitle: 'Shot Checkpoints',
  feedbackTitle: 'Shot Feedback',
  analyze: analyzeShot,
  coach: generateShotCoachingTips,
  liveMetrics: [
    { key: 'spineTilt', label: 'Body lean', compute: spineTiltAngle },
    { key: 'elbow', label: 'Elbow angle', compute: elbowAngle },
  ],
  checkpointDefs: [
    { key: 'stance', label: 'Stance', metric: 'spineTilt', metricLabel: 'Body lean' },
    { key: 'load', label: 'Load', metric: 'kneeBend', metricLabel: 'Knee bend' },
    { key: 'setPoint', label: 'Set Point', metric: 'elbow', metricLabel: 'Elbow angle' },
    { key: 'release', label: 'Release', metric: 'elbow', metricLabel: 'Elbow angle' },
    { key: 'followThrough', label: 'Follow-Through', metric: 'spineTilt', metricLabel: 'Body lean' },
    { key: 'balance', label: 'Balance', metric: 'spineTilt', metricLabel: 'Body lean' },
  ],
}
