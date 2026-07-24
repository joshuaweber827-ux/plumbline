import { keypointsByName, MIN_KEYPOINT_SCORE } from './skeleton'

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function confident(...points) {
  return points.every((p) => p && p.score >= MIN_KEYPOINT_SCORE)
}

// Angle of the shoulder-midpoint -> hip-midpoint line, measured from true
// vertical. 0 = perfectly upright, positive = tilted toward screen-right.
export function spineTiltAngle(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_shoulder, right_shoulder, left_hip, right_hip } = kp
  if (!confident(left_shoulder, right_shoulder, left_hip, right_hip)) return null

  const shoulderMid = midpoint(left_shoulder, right_shoulder)
  const hipMid = midpoint(left_hip, right_hip)
  const dx = shoulderMid.x - hipMid.x
  const dy = shoulderMid.y - hipMid.y
  const radians = Math.atan2(dx, -dy)
  return radians * (180 / Math.PI)
}

// Angle of the line joining both wrists, measured from horizontal.
// Used as a proxy for swing-plane steepness at the top of the backswing.
export function wristLineAngle(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_wrist, right_wrist } = kp
  if (!confident(left_wrist, right_wrist)) return null

  const dx = right_wrist.x - left_wrist.x
  const dy = right_wrist.y - left_wrist.y
  const radians = Math.atan2(dy, dx)
  return radians * (180 / Math.PI)
}

// Average vertical (y) position of both wrists in pixel space, used to find
// the highest point of the swing (smaller y = higher on screen).
export function averageWristY(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_wrist, right_wrist } = kp
  if (!confident(left_wrist, right_wrist)) return null
  return (left_wrist.y + right_wrist.y) / 2
}

export function formatDegrees(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${value.toFixed(1)}°`
}
