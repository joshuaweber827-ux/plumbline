import { analyzeKick } from '../lib/analyzeKick'
import { generateKickCoachingTips } from '../lib/soccerCoaching'
import { spineTiltAngle, kneeBendAngle } from '../lib/angles'

export const soccerSport = {
  id: 'soccer',
  label: 'Soccer',
  icon: '⚽',
  tagline: 'Real pose-detection kick analysis, right in your browser',
  activityLabel: 'kick',
  analyzeLabel: 'Analyze Kick',
  checkpointsTitle: 'Kick Checkpoints',
  feedbackTitle: 'Kick Feedback',
  analyze: analyzeKick,
  coach: generateKickCoachingTips,
  liveMetrics: [
    { key: 'spineTilt', label: 'Body lean', compute: spineTiltAngle },
    { key: 'kneeBend', label: 'Knee bend', compute: kneeBendAngle },
  ],
  checkpointDefs: [
    { key: 'stance', label: 'Stance', metric: 'spineTilt', metricLabel: 'Body lean' },
    { key: 'plant', label: 'Plant', metric: 'kneeBend', metricLabel: 'Knee bend' },
    { key: 'backswing', label: 'Backswing', metric: 'hipRotation', metricLabel: 'Hip rotation' },
    { key: 'contact', label: 'Contact', metric: 'hipRotation', metricLabel: 'Hip rotation' },
    { key: 'followThrough', label: 'Follow-Through', metric: 'spineTilt', metricLabel: 'Body lean' },
    { key: 'finish', label: 'Finish', metric: 'spineTilt', metricLabel: 'Body lean' },
  ],
}
