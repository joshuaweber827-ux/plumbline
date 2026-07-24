// MoveNet's 17 COCO keypoints, in output order.
export const KEYPOINT_NAMES = [
  'nose',
  'left_eye',
  'right_eye',
  'left_ear',
  'right_ear',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
]

// Bone connections drawn between keypoint pairs to render the skeleton.
export const SKELETON_EDGES = [
  ['nose', 'left_eye'],
  ['nose', 'right_eye'],
  ['left_eye', 'left_ear'],
  ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
]

export const MIN_KEYPOINT_SCORE = 0.3

export function keypointsByName(keypoints) {
  const map = {}
  for (const kp of keypoints) {
    map[kp.name] = kp
  }
  return map
}

export function drawSkeleton(ctx, keypoints, { flagOrange = '#de6640', chalk = '#f4f1e4' } = {}) {
  if (!keypoints || keypoints.length === 0) return
  const byName = keypointsByName(keypoints)

  ctx.lineWidth = 3
  ctx.strokeStyle = flagOrange
  ctx.lineCap = 'round'
  for (const [a, b] of SKELETON_EDGES) {
    const pa = byName[a]
    const pb = byName[b]
    if (!pa || !pb) continue
    if (pa.score < MIN_KEYPOINT_SCORE || pb.score < MIN_KEYPOINT_SCORE) continue
    ctx.beginPath()
    ctx.moveTo(pa.x, pa.y)
    ctx.lineTo(pb.x, pb.y)
    ctx.stroke()
  }

  for (const kp of keypoints) {
    if (kp.score < MIN_KEYPOINT_SCORE) continue
    ctx.beginPath()
    ctx.fillStyle = chalk
    ctx.arc(kp.x, kp.y, 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = flagOrange
    ctx.stroke()
  }
}
