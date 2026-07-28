const KNEE_BEND_THRESHOLD = 165
const HIP_ROTATION_TARGET = 15
const CONTACT_LEAN_THRESHOLD = 12
const BALANCE_THRESHOLD = 10

// Every check compares the kicker's own checkpoints against each other
// rather than absolute "ideal" angles — a single uncalibrated camera can't
// reliably support the latter for a fast, rotational motion like this.
export function generateKickCoachingTips(checkpoints) {
  if (!checkpoints) return []
  const { stance, plant, backswing, contact, finish } = checkpoints
  const tips = []

  if (plant?.kneeBend != null) {
    if (plant.kneeBend > KNEE_BEND_THRESHOLD) {
      tips.push({
        id: 'plant-knee-watch',
        severity: 'watch',
        title: 'Bend your plant knee more',
        detail: 'Your standing leg looks quite straight as you plant next to the ball. A slight bend there helps with balance and control.',
        betterForm:
          "A good plant leg has a soft bend in the knee, almost like you're standing ready to absorb an impact — not locked straight.",
      })
    } else {
      tips.push({
        id: 'plant-knee-good',
        severity: 'good',
        title: 'Good plant-leg bend',
        detail: 'Your standing leg has a nice bit of flex as you plant — that helps you stay balanced through the kick.',
      })
    }
  }

  if (backswing?.hipRotation != null && contact?.hipRotation != null) {
    const delta = Math.abs(contact.hipRotation - backswing.hipRotation)
    if (delta < HIP_ROTATION_TARGET) {
      tips.push({
        id: 'hip-rotation-watch',
        severity: 'watch',
        title: 'Rotate your hips more through the ball',
        detail: "Your hips don't open up much between your backswing and contact. Driving your hips through the ball as your leg swings forward usually adds power.",
        betterForm:
          'Good technique often looks like the hips leading the leg through contact — think about turning your belt buckle toward the target as you strike the ball.',
      })
    } else {
      tips.push({
        id: 'hip-rotation-good',
        severity: 'good',
        title: 'Good hip drive through contact',
        detail: 'Your hips rotate well from backswing into contact — that rotation is a big source of power in a kick.',
      })
    }
  }

  if (stance?.spineTilt != null && contact?.spineTilt != null) {
    const delta = Math.abs(contact.spineTilt - stance.spineTilt)
    if (delta > CONTACT_LEAN_THRESHOLD) {
      tips.push({
        id: 'contact-lean-watch',
        severity: 'watch',
        title: "Try not to lean back at contact",
        detail: 'Your body tilts noticeably by the time you strike the ball. Staying more upright through contact usually helps accuracy and power.',
        betterForm:
          'Solid technique usually has the body over or slightly ahead of the ball at contact, not leaning back away from it.',
      })
    } else {
      tips.push({
        id: 'contact-lean-good',
        severity: 'good',
        title: 'Good posture through contact',
        detail: 'Your body stays fairly steady from your stance into contact — that helps you strike the ball cleanly.',
      })
    }
  }

  if (stance?.spineTilt != null && finish?.spineTilt != null) {
    const delta = Math.abs(finish.spineTilt - stance.spineTilt)
    if (delta > BALANCE_THRESHOLD) {
      tips.push({
        id: 'balance-watch',
        severity: 'watch',
        title: 'Work on finishing balanced',
        detail: 'You land in a noticeably different body position than you started in. Try to control your follow-through instead of falling off to one side.',
        betterForm:
          'A balanced finish often looks like a small hop or step to absorb the follow-through, landing roughly under your body rather than falling away from it.',
      })
    } else {
      tips.push({
        id: 'balance-good',
        severity: 'good',
        title: 'Balanced start to finish',
        detail: 'Your body position at the end is close to where you started — a sign of good balance and control through the kick.',
      })
    }
  }

  if (tips.length === 0) {
    tips.push({
      id: 'no-signal',
      severity: 'info',
      title: "Couldn't get a clear read on your kick",
      detail: "We didn't detect your body clearly enough at key moments to give feedback. Try a well-lit video with your full body in frame, from your stance through your follow-through.",
    })
  }

  return tips
}
