import { averageHipY, averageWristY, elbowAngle, kneeBendAngle, spineTiltAngle } from './angles'
import { indexOfMax, indexOfMin, seekTo } from './videoSampling'

const SAMPLE_COUNT = 48

// Steps through the whole clip, running pose detection on evenly spaced
// samples, then derives six checkpoints from the real keypoint data: the
// load is the deepest hip drop (knee bend) in the first half of the clip,
// and the release is the highest point the wrists reach after that — full
// arm extension, where the ball leaves the shooter's hand.
export async function analyzeShot(video, detector, { onProgress } = {}) {
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
    wristY: s.keypoints ? averageWristY(s.keypoints) : null,
    hipY: s.keypoints ? averageHipY(s.keypoints) : null,
  }))

  const stanceIndex = 0

  const loadWindow = withSignals.slice(0, Math.ceil(SAMPLE_COUNT * 0.5))
  const loadIndex = indexOfMax(loadWindow, (s) => s.hipY) ?? stanceIndex

  const releaseWindow = withSignals.slice(loadIndex)
  const releaseIndexRaw = indexOfMin(releaseWindow, (s) => s.wristY)
  const releaseIndex = releaseIndexRaw == null ? SAMPLE_COUNT - 1 : releaseIndexRaw + loadIndex

  const setPointIndex = Math.min(Math.max(loadIndex + 1, Math.floor((loadIndex + releaseIndex) / 2)), releaseIndex)
  const followThroughIndex = Math.min(releaseIndex + 2, SAMPLE_COUNT - 1)
  const balanceIndex = SAMPLE_COUNT - 1

  const checkpointIndices = {
    stance: stanceIndex,
    load: loadIndex,
    setPoint: setPointIndex,
    release: releaseIndex,
    followThrough: followThroughIndex,
    balance: balanceIndex,
  }

  const checkpoints = {}
  for (const [key, idx] of Object.entries(checkpointIndices)) {
    const sample = withSignals[idx]
    checkpoints[key] = {
      time: sample.time,
      spineTilt: sample.keypoints ? spineTiltAngle(sample.keypoints) : null,
      elbow: sample.keypoints ? elbowAngle(sample.keypoints) : null,
      kneeBend: sample.keypoints ? kneeBendAngle(sample.keypoints) : null,
    }
  }

  return { samples, checkpoints }
}
