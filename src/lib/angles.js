import { keypointsByName, MIN_KEYPOINT_SCORE } from './skeleton'

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function confident(...points) {
  return points.every((p) => p && p.score >= MIN_KEYPOINT_SCORE)
}

// Interior angle at vertex b, formed by rays b->a and b->c, in [0, 180].
// 180 = a and c are in a straight line through b (fully extended limb).
function angleAtVertex(a, b, c) {
  const abx = a.x - b.x
  const aby = a.y - b.y
  const cbx = c.x - b.x
  const cby = c.y - b.y
  const magAB = Math.hypot(abx, aby)
  const magCB = Math.hypot(cbx, cby)
  if (magAB === 0 || magCB === 0) return null
  const cos = Math.min(1, Math.max(-1, (abx * cbx + aby * cby) / (magAB * magCB)))
  return Math.acos(cos) * (180 / Math.PI)
}

// Picks whichever side (left/right) has more confident keypoints across the
// given triples — used where we don't know which arm/leg is the active one.
function pickConfidentSide(kp, leftNames, rightNames) {
  const left = leftNames.map((n) => kp[n])
  const right = rightNames.map((n) => kp[n])
  const score = (pts) => (pts.every((p) => p) ? pts.reduce((sum, p) => sum + p.score, 0) : -1)
  const leftScore = score(left)
  const rightScore = score(right)
  if (leftScore < 0 && rightScore < 0) return null
  const best = leftScore >= rightScore ? left : right
  return best.every((p) => p.score >= MIN_KEYPOINT_SCORE) ? best : null
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

// Angle of the line a->b, measured from horizontal.
function lineAngleDegrees(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)
}

// Angle of the line joining both wrists, measured from horizontal.
// Used as a proxy for swing-plane steepness at the top of the backswing.
export function wristLineAngle(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_wrist, right_wrist } = kp
  if (!confident(left_wrist, right_wrist)) return null
  return lineAngleDegrees(left_wrist, right_wrist)
}

// Rotational difference between the shoulder line and the hip line — a 2D
// proxy for hip-shoulder separation ("X-factor"): how coiled the torso is
// relative to the hips at a given moment.
export function hipShoulderSeparation(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_shoulder, right_shoulder, left_hip, right_hip } = kp
  if (!confident(left_shoulder, right_shoulder, left_hip, right_hip)) return null
  let diff = lineAngleDegrees(left_shoulder, right_shoulder) - lineAngleDegrees(left_hip, right_hip)
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff
}

// Average vertical (y) position of both wrists in pixel space, used to find
// the highest point of the swing (smaller y = higher on screen).
export function averageWristY(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_wrist, right_wrist } = kp
  if (!confident(left_wrist, right_wrist)) return null
  return (left_wrist.y + right_wrist.y) / 2
}

// Average (x, y) position of both wrists in pixel space, used to measure
// hand speed frame-to-frame.
export function averageWristPosition(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_wrist, right_wrist } = kp
  if (!confident(left_wrist, right_wrist)) return null
  return { x: (left_wrist.x + right_wrist.x) / 2, y: (left_wrist.y + right_wrist.y) / 2 }
}

// Average vertical (y) position of both hips, used to find the lowest point
// of a knee bend (larger y = lower on screen).
export function averageHipY(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_hip, right_hip } = kp
  if (!confident(left_hip, right_hip)) return null
  return (left_hip.y + right_hip.y) / 2
}

// Pixel distance between the two ankles — used to track how far the kicking
// foot swings from the plant foot (large = backswing, small = feet together
// at contact). Only meaningful for relative comparisons within one video,
// never displayed directly since it isn't scale-normalized.
export function ankleDistance(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_ankle, right_ankle } = kp
  if (!confident(left_ankle, right_ankle)) return null
  return Math.hypot(left_ankle.x - right_ankle.x, left_ankle.y - right_ankle.y)
}

// Angle of the line joining both hips, measured from horizontal — a proxy
// for how open/rotated the hips are at a given moment.
export function hipLineAngle(keypoints) {
  const kp = keypointsByName(keypoints)
  const { left_hip, right_hip } = kp
  if (!confident(left_hip, right_hip)) return null
  return lineAngleDegrees(left_hip, right_hip)
}

// Elbow bend of whichever arm (shoulder-elbow-wrist) has the more confident
// keypoints — a stand-in for "which arm is shooting" since we don't track
// handedness. 180 = fully extended arm.
export function elbowAngle(keypoints) {
  const kp = keypointsByName(keypoints)
  const side = pickConfidentSide(
    kp,
    ['left_shoulder', 'left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow', 'right_wrist'],
  )
  if (!side) return null
  const [shoulder, elbow, wrist] = side
  return angleAtVertex(shoulder, elbow, wrist)
}

// Knee bend of whichever leg (hip-knee-ankle) has the more confident
// keypoints. 180 = fully straight leg, smaller = deeper bend.
export function kneeBendAngle(keypoints) {
  const kp = keypointsByName(keypoints)
  const side = pickConfidentSide(kp, ['left_hip', 'left_knee', 'left_ankle'], ['right_hip', 'right_knee', 'right_ankle'])
  if (!side) return null
  const [hip, knee, ankle] = side
  return angleAtVertex(hip, knee, ankle)
}

export function formatDegrees(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${value.toFixed(1)}°`
}
