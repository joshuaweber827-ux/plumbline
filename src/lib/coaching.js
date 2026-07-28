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
          betterForm:
            "Good tempo often feels like counting \"1-2-3\" going back and \"1\" coming down — a clear pause at the top before the club starts moving again.",
        })
      } else if (ratio > TEMPO_TARGET + TEMPO_TOLERANCE) {
        tips.push({
          id: 'tempo-slow-downswing',
          severity: 'watch',
          title: 'Be more decisive coming down',
          detail: "You take your time going back, then ease into the ball. Try committing to the downswing a bit more — it's often where speed gets lost.",
          betterForm:
            'Try feeling a smooth build in speed through the downswing, so your fastest moment is right at the ball — not before it.',
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
        betterForm:
          'Picture a line running from the top of your head through your tailbone at address — solid ball-strikers keep roughly that same tilt all the way to impact instead of standing up or dropping down.',
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
        betterForm: 'A good backswing turn keeps your head roughly over the same spot — like turning inside a barrel instead of sliding to one side.',
      })
    } else {
      tips.push({
        id: 'top-sway-good',
        severity: 'good',
        title: 'Stayed centered on the backswing',
        detail: 'Your upper body stays fairly centered as you swing back — a stable base to swing down from.',
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
        betterForm:
          'A repeatable backswing keeps the club moving on one steady path from takeaway to the top, without a late steepening or flattening move.',
      })
    } else {
      tips.push({
        id: 'plane-consistency-good',
        severity: 'good',
        title: 'Consistent backswing path',
        detail: 'Your hands and arms keep a steady path into the top of your backswing — that repeatability helps the downswing.',
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
