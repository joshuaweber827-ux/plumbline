import { elbowAngle, kneeBendAngle, spineTiltAngle } from './angles'
import { indexOfMax, indexOfMin, seekTo } from './videoSampling'

const SAMPLE_COUNT = 48

// Steps through the whole clip, then derives six checkpoints from elbow
// angle trajectory: the load is where the throwing arm is most bent (ball
// cocked near the ear), and release is the most extended arm found after
// that — a signal that holds regardless of camera angle since it tracks the
// arm's own flexion rather than an absolute on-screen position.
export async function analyzeThrow(video, detector, { onProgress } = {}) {
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
    elbow: s.keypoints ? elbowAngle(s.keypoints) : null,
  }))

  const stanceIndex = 0

  const loadWindow = withSignals.slice(0, Math.ceil(SAMPLE_COUNT * 0.6))
  const loadIndex = indexOfMin(loadWindow, (s) => s.elbow) ?? stanceIndex

  const releaseWindow = withSignals.slice(loadIndex)
  const releaseIndexRaw = indexOfMax(releaseWindow, (s) => s.elbow)
  const releaseIndex = releaseIndexRaw == null ? Math.min(loadIndex + 1, SAMPLE_COUNT - 1) : releaseIndexRaw + loadIndex

  const strideIndex = Math.min(Math.max(loadIndex + 1, Math.floor((loadIndex + releaseIndex) / 2)), releaseIndex)
  const followThroughIndex = Math.min(releaseIndex + 2, SAMPLE_COUNT - 1)
  const finishIndex = SAMPLE_COUNT - 1

  const checkpointIndices = {
    stance: stanceIndex,
    load: loadIndex,
    stride: strideIndex,
    release: releaseIndex,
    followThrough: followThroughIndex,
    finish: finishIndex,
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
