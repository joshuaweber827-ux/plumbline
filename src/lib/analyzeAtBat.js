import { averageWristPosition, elbowAngle, hipShoulderSeparation, kneeBendAngle, spineTiltAngle } from './angles'
import { indexOfMax, seekTo } from './videoSampling'

const SAMPLE_COUNT = 48

function wristDistance(a, b) {
  if (!a || !b) return null
  return Math.hypot(a.x - b.x, a.y - b.y)
}

// Steps through the whole clip, then derives six checkpoints from the real
// keypoint data: the load is where hip-shoulder separation (torso coil)
// peaks, and contact is found from peak hand speed — bat speed peaks right
// around contact regardless of camera angle, which is far more reliable
// than trying to infer ball/bat position from body pose alone.
export async function analyzeAtBat(video, detector, { onProgress } = {}) {
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
    wristPos: s.keypoints ? averageWristPosition(s.keypoints) : null,
    separation: s.keypoints ? hipShoulderSeparation(s.keypoints) : null,
  }))

  const stanceIndex = 0

  const loadWindow = withSignals.slice(0, Math.ceil(SAMPLE_COUNT * 0.65))
  const loadIndex = indexOfMax(loadWindow, (s) => (s.separation == null ? null : Math.abs(s.separation))) ?? stanceIndex

  const speeds = withSignals.map((s, i) => (i === 0 ? null : wristDistance(withSignals[i - 1].wristPos, s.wristPos)))
  const contactWindow = speeds.slice(loadIndex)
  const contactIndexRaw = indexOfMax(contactWindow, (v) => v)
  const contactIndex = contactIndexRaw == null ? Math.min(loadIndex + 1, SAMPLE_COUNT - 1) : contactIndexRaw + loadIndex

  const strideIndex = Math.min(Math.max(loadIndex + 1, Math.floor((loadIndex + contactIndex) / 2)), contactIndex)
  const extensionIndex = Math.min(contactIndex + 2, SAMPLE_COUNT - 1)
  const finishIndex = SAMPLE_COUNT - 1

  const checkpointIndices = {
    stance: stanceIndex,
    load: loadIndex,
    stride: strideIndex,
    contact: contactIndex,
    extension: extensionIndex,
    finish: finishIndex,
  }

  const checkpoints = {}
  for (const [key, idx] of Object.entries(checkpointIndices)) {
    const sample = withSignals[idx]
    checkpoints[key] = {
      time: sample.time,
      spineTilt: sample.keypoints ? spineTiltAngle(sample.keypoints) : null,
      separation: sample.keypoints ? hipShoulderSeparation(sample.keypoints) : null,
      elbow: sample.keypoints ? elbowAngle(sample.keypoints) : null,
      kneeBend: sample.keypoints ? kneeBendAngle(sample.keypoints) : null,
    }
  }

  return { samples, checkpoints }
}
