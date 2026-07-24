const TEMPO_TARGET = 3
const TEMPO_TOLERANCE = 0.6
const SPINE_STABILITY_THRESHOLD = 8
const SWAY_THRESHOLD = 10
const PLANE_CONSISTENCY_THRESHOLD = 12

// Every tip compares the golfer's own swing against itself (tempo ratio,
// posture change from setup to impact, etc.) rather than absolute "ideal"
// angles — a single uncalibrated camera can't reliably support the latter,
// but relative, self-referential deltas hold up regardless of framing.
export function generateCoachingTips(checkpoints) {
  if (!checkpoints) return []
  const { setup, backswing, top, impact } = checkpoints
  const tips = []

  if (setup && top && impact) {
    const backswingDuration = top.time - setup.time
    const downswingDuration = impact.time - top.time
    if (backswingDuration > 0 && downswingDuration > 0) {
      const ratio = backswingDuration / downswingDuration
      if (ratio < TEMPO_TARGET - TEMPO_TOLERANCE) {
        tips.push({
          id: 'tempo-fast-downswing',
          severity: 'watch',
          title: 'Downswing looks rushed',
          detail: `Backswing-to-downswing tempo is about ${ratio.toFixed(1)}:1 (tour average is close to 3:1). Let the transition settle before accelerating into the ball.`,
        })
      } else if (ratio > TEMPO_TARGET + TEMPO_TOLERANCE) {
        tips.push({
          id: 'tempo-slow-downswing',
          severity: 'watch',
          title: 'Tempo is backswing-heavy',
          detail: `Backswing-to-downswing tempo is about ${ratio.toFixed(1)}:1, slower than the ~3:1 tour average. A bit more commitment through impact can add speed.`,
        })
      } else {
        tips.push({
          id: 'tempo-good',
          severity: 'good',
          title: 'Solid tempo ratio',
          detail: `Backswing-to-downswing tempo is about ${ratio.toFixed(1)}:1 — right in the range tour pros average.`,
        })
      }
    }
  }

  if (setup?.spineTilt != null && impact?.spineTilt != null) {
    const delta = Math.abs(impact.spineTilt - setup.spineTilt)
    if (delta > SPINE_STABILITY_THRESHOLD) {
      tips.push({
        id: 'spine-stability-watch',
        severity: 'watch',
        title: 'Losing posture through impact',
        detail: `Spine tilt shifted about ${delta.toFixed(1)}° between setup and impact. Holding your setup angle into the ball tends to improve contact consistency.`,
      })
    } else {
      tips.push({
        id: 'spine-stability-good',
        severity: 'good',
        title: 'Stable spine angle',
        detail: `Spine tilt only shifted about ${delta.toFixed(1)}° from setup to impact — good posture retention.`,
      })
    }
  }

  if (setup?.spineTilt != null && top?.spineTilt != null) {
    const delta = Math.abs(top.spineTilt - setup.spineTilt)
    if (delta > SWAY_THRESHOLD) {
      tips.push({
        id: 'top-sway',
        severity: 'watch',
        title: 'Big upper-body shift on the backswing',
        detail: `Spine tilt moved about ${delta.toFixed(1)}° from setup to the top. If that looks like a sway or reverse tilt on video, focus on turning around a steadier spine angle.`,
      })
    }
  }

  if (backswing?.swingPlane != null && top?.swingPlane != null) {
    const delta = Math.abs(top.swingPlane - backswing.swingPlane)
    if (delta > PLANE_CONSISTENCY_THRESHOLD) {
      tips.push({
        id: 'plane-consistency',
        severity: 'watch',
        title: 'Plane shifts late in the backswing',
        detail: `The wrist-line angle changes about ${delta.toFixed(1)}° between mid-backswing and the top. A late steepening or flattening can make the downswing plane harder to repeat.`,
      })
    }
  }

  if (tips.length === 0) {
    tips.push({
      id: 'no-signal',
      severity: 'info',
      title: 'Not enough confident keypoints',
      detail: 'Pose detection didn’t find enough confident joints at these checkpoints to generate feedback. Try a clearer, well-lit video with the golfer fully in frame.',
    })
  }

  return tips
}
