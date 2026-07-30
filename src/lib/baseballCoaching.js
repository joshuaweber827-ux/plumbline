import { ensureOneStrength } from './feedbackBalance'

const SEPARATION_TARGET = 15
const KNEE_BEND_THRESHOLD = 165
const EXTENSION_TARGET = 150
const BALANCE_THRESHOLD = 10

// Contact extension leans on a fixed target (a fairly straight arm through
// the ball reads as such from most angles); separation, knee bend, and
// balance all compare the hitter's own checkpoints against each other.
export function generateAtBatCoachingTips(checkpoints) {
  if (!checkpoints) return []
  const { stance, load, stride, contact, finish } = checkpoints
  const tips = []
  const watchCandidates = []

  if (load?.separation != null) {
    const magnitude = Math.abs(load.separation)
    if (magnitude < SEPARATION_TARGET) {
      tips.push({
        id: 'separation-watch',
        severity: 'watch',
        title: 'Try creating more coil on your load',
        detail: "Your shoulders and hips don't turn away from each other much as you load. Letting your shoulders turn back while your hips stay a bit quieter can build more power into your swing.",
        betterForm:
          'A strong load looks like your belt buckle facing the pitcher a beat longer while your shoulders keep turning back — like winding up a rubber band before it snaps forward.',
      })
      watchCandidates.push({
        id: 'separation-watch',
        ratio: (SEPARATION_TARGET - magnitude) / SEPARATION_TARGET,
        closeTitle: 'Torso coil is your strongest area',
        closeDetail: 'Your hip-shoulder separation is closer to a strong coil than your other checks — a bit more shoulder turn will add real power.',
      })
    } else {
      tips.push({
        id: 'separation-good',
        severity: 'good',
        title: 'Good coil on your load',
        detail: 'Your shoulders turn well away from your hips as you load — that separation is a big source of bat speed.',
      })
    }
  }

  if (stride?.kneeBend != null) {
    if (stride.kneeBend > KNEE_BEND_THRESHOLD) {
      tips.push({
        id: 'stride-knee-watch',
        severity: 'watch',
        title: 'Soften your front leg at foot strike',
        detail: 'Your front leg looks quite straight as your stride foot lands. A bit more flex there helps you stay balanced and use your lower half.',
        betterForm: 'A good stride lands with a slightly bent front knee that can absorb your weight, not a stiff, locked-out leg.',
      })
      watchCandidates.push({
        id: 'stride-knee-watch',
        ratio: (stride.kneeBend - KNEE_BEND_THRESHOLD) / 25,
        closeTitle: 'Front-leg flex is your strongest area',
        closeDetail: 'Your front knee bend at foot strike is closer to ideal than your other checks.',
      })
    } else {
      tips.push({
        id: 'stride-knee-good',
        severity: 'good',
        title: 'Good front-leg flex',
        detail: 'Your front knee has a nice bend when your stride foot lands — that helps you stay balanced through the swing.',
      })
    }
  }

  if (contact?.elbow != null) {
    if (contact.elbow < EXTENSION_TARGET) {
      tips.push({
        id: 'contact-extension-watch',
        severity: 'watch',
        title: 'Extend through the ball more',
        detail: 'Your arms look a little collapsed around contact. Reaching out through the ball more can add power and consistency.',
        betterForm: 'Good contact often looks like your back arm nearly straightening as it drives through the ball, rather than staying tucked and bent.',
      })
      watchCandidates.push({
        id: 'contact-extension-watch',
        ratio: (EXTENSION_TARGET - contact.elbow) / (EXTENSION_TARGET - 90),
        closeTitle: 'Extension is your strongest area',
        closeDetail: 'Your arm extension around contact is closer to fully driving through the ball than your other checks.',
      })
    } else {
      tips.push({
        id: 'contact-extension-good',
        severity: 'good',
        title: 'Good extension at contact',
        detail: 'Your arms are nicely extended right around contact — that helps you drive through the ball.',
      })
    }
  }

  if (stance?.spineTilt != null && finish?.spineTilt != null) {
    const delta = Math.abs(finish.spineTilt - stance.spineTilt)
    if (delta > BALANCE_THRESHOLD) {
      tips.push({
        id: 'balance-watch',
        severity: 'watch',
        title: 'Work on staying balanced',
        detail: 'You finish in a noticeably different body position than you started in. Try to keep your head and body under control instead of drifting or falling off balance.',
        betterForm:
          'Try finishing your swing balanced, with your back foot pivoted and your head still — not falling forward or spinning off balance.',
      })
      watchCandidates.push({
        id: 'balance-watch',
        ratio: delta / BALANCE_THRESHOLD,
        closeTitle: 'Balance is your strongest area',
        closeDetail: 'You finish closer to your starting position than your other checks — keep building on that control.',
      })
    } else {
      tips.push({
        id: 'balance-good',
        severity: 'good',
        title: 'Balanced start to finish',
        detail: 'Your body position at the end is close to where you started — a sign of good balance through your swing.',
      })
    }
  }

  const balanced = ensureOneStrength(tips, watchCandidates)

  if (balanced.length === 0) {
    balanced.push({
      id: 'no-signal',
      severity: 'info',
      title: "Couldn't get a clear read on your swing",
      detail: "We didn't detect your body clearly enough at key moments to give feedback. Try a well-lit video with your full body in frame, from your stance through your follow-through.",
    })
  }

  return balanced
}
