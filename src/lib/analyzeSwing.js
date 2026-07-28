import { averageWristY, spineTiltAngle, torsoLength, wristLineAngle } from './angles'
import { seekTo, indexOfMin, median, rangeOf } from './videoSampling'

const SAMPLE_COUNT = 48

// A real backswing lifts the hands a substantial fraction of a torso-length
// upward; this floor is deliberately lenient (a false "wrong sport" verdict
// on a genuine swing is worse than occasionally missing a mismatch).
const MOTION_THRESHOLD = 0.35

// Steps through the whole clip, running pose detection on evenly spaced
// samples, then derives the six checkpoints from the real keypoint data:
// the top of the backswing is the sample with the highest (min-y) wrists,
// impact is found by matching wrist height back down against address, and
// the finish is the highest wrist point after impact.
export async function analyzeSwing(video, detector, { onProgress } = {}) {
  const duration = video.duration
  const samples = []

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const time = (i / (SAMPLE_COUNT - 1)) * duration
    await seekTo(video, time)
    const poses = await detector.estimatePoses(video, { flipHorizontal: false })
    const keypoints = poses[0]?.keypoints ?? null
    samples.push({ time, keypoints })
    onProgress?.((i + 1) / SAMPLE_COUNT)
  }

  const withWristY = samples.map((s) => ({
    ...s,
    wristY: s.keypoints ? averageWristY(s.keypoints) : null,
    torso: s.keypoints ? torsoLength(s.keypoints) : null,
  }))

  const scale = median(withWristY.map((s) => s.torso))
  const wristRange = rangeOf(withWristY.map((s) => s.wristY))
  const plausible = scale != null && wristRange != null && wristRange / scale > MOTION_THRESHOLD

  const addressIndex = 0

  const backswingWindow = withWristY.slice(0, Math.ceil(SAMPLE_COUNT * 0.65))
  const topIndex = indexOfMin(backswingWindow, (s) => s.wristY) ?? addressIndex

  const transitionIndex = Math.min(topIndex + 2, SAMPLE_COUNT - 1)

  const addressWristY = withWristY[addressIndex].wristY
  const impactWindow = withWristY.slice(topIndex)
  const impactIndex =
    addressWristY == null
      ? Math.min(topIndex + Math.floor((SAMPLE_COUNT - topIndex) / 2), SAMPLE_COUNT - 1)
      : (indexOfMin(impactWindow, (s) => (s.wristY == null ? null : Math.abs(s.wristY - addressWristY))) ?? 0) +
        topIndex

  const followWindow = withWristY.slice(Math.min(impactIndex + 1, SAMPLE_COUNT - 1))
  const followIndexRaw = indexOfMin(followWindow, (s) => s.wristY)
  const followIndex =
    followIndexRaw == null ? SAMPLE_COUNT - 1 : followIndexRaw + Math.min(impactIndex + 1, SAMPLE_COUNT - 1)

  const checkpointIndices = {
    setup: addressIndex,
    backswing: Math.max(1, Math.floor(topIndex / 2)),
    top: topIndex,
    transition: transitionIndex,
    impact: impactIndex,
    follow: followIndex,
  }

  const checkpoints = {}
  for (const [key, idx] of Object.entries(checkpointIndices)) {
    const sample = withWristY[idx]
    checkpoints[key] = {
      time: sample.time,
      spineTilt: sample.keypoints ? spineTiltAngle(sample.keypoints) : null,
      swingPlane: sample.keypoints ? wristLineAngle(sample.keypoints) : null,
    }
  }

  return { samples, checkpoints, plausible }
}
