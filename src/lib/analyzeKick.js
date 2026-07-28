import { ankleDistance, hipLineAngle, kneeBendAngle, spineTiltAngle, torsoLength } from './angles'
import { indexOfMax, indexOfMin, median, rangeOf, seekTo } from './videoSampling'

const SAMPLE_COUNT = 48

// A real kick swings the kicking foot a substantial fraction of a
// torso-length away from the plant foot; kept lenient on purpose (see
// analyzeSwing.js).
const MOTION_THRESHOLD = 0.45

// Steps through the whole clip, then derives six checkpoints using ankle
// separation as the core signal: the kicking foot swings far from the plant
// foot during the backswing (max separation), then the two feet come back
// together at contact (min separation after that) — a trajectory shape
// that holds regardless of camera angle, since we aren't tracking the ball.
export async function analyzeKick(video, detector, { onProgress } = {}) {
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

  const withSignals = samples.map((s) => ({
    ...s,
    ankleGap: s.keypoints ? ankleDistance(s.keypoints) : null,
    torso: s.keypoints ? torsoLength(s.keypoints) : null,
  }))

  const scale = median(withSignals.map((s) => s.torso))
  const gapRange = rangeOf(withSignals.map((s) => s.ankleGap))
  const plausible = scale != null && gapRange != null && gapRange / scale > MOTION_THRESHOLD

  const stanceIndex = 0

  const plantWindow = withSignals.slice(0, Math.ceil(SAMPLE_COUNT * 0.4))
  const plantIndex = indexOfMin(plantWindow, (s) => s.ankleGap) ?? stanceIndex

  const backswingWindow = withSignals.slice(plantIndex, Math.ceil(SAMPLE_COUNT * 0.8))
  const backswingIndexRaw = indexOfMax(backswingWindow, (s) => s.ankleGap)
  const backswingIndex = backswingIndexRaw == null ? plantIndex : backswingIndexRaw + plantIndex

  const contactWindow = withSignals.slice(backswingIndex)
  const contactIndexRaw = indexOfMin(contactWindow, (s) => s.ankleGap)
  const contactIndex =
    contactIndexRaw == null ? Math.min(backswingIndex + 1, SAMPLE_COUNT - 1) : contactIndexRaw + backswingIndex

  const followThroughIndex = Math.min(contactIndex + 2, SAMPLE_COUNT - 1)
  const finishIndex = SAMPLE_COUNT - 1

  const checkpointIndices = {
    stance: stanceIndex,
    plant: plantIndex,
    backswing: backswingIndex,
    contact: contactIndex,
    followThrough: followThroughIndex,
    finish: finishIndex,
  }

  const checkpoints = {}
  for (const [key, idx] of Object.entries(checkpointIndices)) {
    const sample = withSignals[idx]
    checkpoints[key] = {
      time: sample.time,
      spineTilt: sample.keypoints ? spineTiltAngle(sample.keypoints) : null,
      hipRotation: sample.keypoints ? hipLineAngle(sample.keypoints) : null,
      kneeBend: sample.keypoints ? kneeBendAngle(sample.keypoints) : null,
    }
  }

  return { samples, checkpoints, plausible }
}
