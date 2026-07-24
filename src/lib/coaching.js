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
          title: 'Try slowing down at the top',
          detail: 'Your downswing happens much faster than your backswing. Pause briefly at the top before starting down — it usually helps timing.',
        })
      } else if (ratio > TEMPO_TARGET + TEMPO_TOLERANCE) {
        tips.push({
          id: 'tempo-slow-downswing',
          severity: 'watch',
          title: 'Be more decisive coming down',
          detail: "You take your time going back, then ease into the ball. Try committing to the downswing a bit more — it's often where speed gets lost.",
        })
      } else {
        tips.push({
          id: 'tempo-good',
          severity: 'good',
          title: 'Good rhythm',
          detail: 'The pace of your backswing and downswing are well matched — that timing is a big part of a repeatable swing.',
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
        title: 'Try holding your posture longer',
        detail: "Your body position at impact looks noticeably different from your setup. Try keeping the same forward bend you started with all the way through the ball — it usually leads to more solid contact.",
      })
    } else {
      tips.push({
        id: 'spine-stability-good',
        severity: 'good',
        title: 'Good, steady posture',
        detail: 'Your body position barely changes from setup to impact — that consistency helps you strike the ball the same way every time.',
      })
    }
  }

  if (setup?.spineTilt != null && top?.spineTilt != null) {
    const delta = Math.abs(top.spineTilt - setup.spineTilt)
    if (delta > SWAY_THRESHOLD) {
      tips.push({
        id: 'top-sway',
        severity: 'watch',
        title: 'Watch for swaying off the ball',
        detail: "Your upper body shifts a good amount going back. Try to turn in place rather than sliding side to side — it'll help you stay centered over the ball.",
      })
    }
  }

  if (backswing?.swingPlane != null && top?.swingPlane != null) {
    const delta = Math.abs(top.swingPlane - backswing.swingPlane)
    if (delta > PLANE_CONSISTENCY_THRESHOLD) {
      tips.push({
        id: 'plane-consistency',
        severity: 'watch',
        title: 'Backswing path could be more consistent',
        detail: 'Your hands and arms change direction noticeably right near the top of your backswing. A smoother, more consistent path back tends to make the downswing easier to repeat.',
      })
    }
  }

  if (tips.length === 0) {
    tips.push({
      id: 'no-signal',
      severity: 'info',
      title: "Couldn't get a clear read on your swing",
      detail: "We didn't detect your body clearly enough at key moments to give feedback. Try a well-lit video with your full body in frame, from address to follow-through.",
    })
  }

  return tips
}
