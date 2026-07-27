const LOAD_ELBOW_MAX = 130
const RELEASE_EXTENSION_TARGET = 155
const KNEE_BEND_THRESHOLD = 165
const BALANCE_THRESHOLD = 10

// Release extension leans on a fixed target (a fairly straight arm at the
// moment of release reads as such from most camera angles), which is more
// reliable with a single uncalibrated camera than a precise mid-range
// target; the rest compare the thrower's own checkpoints against each other.
export function generateThrowCoachingTips(checkpoints) {
  if (!checkpoints) return []
  const { stance, load, stride, release, finish } = checkpoints
  const tips = []

  if (load?.elbow != null) {
    if (load.elbow > LOAD_ELBOW_MAX) {
      tips.push({
        id: 'load-elbow-watch',
        severity: 'watch',
        title: 'Get a tighter bend as you load',
        detail: "Your arm doesn't get very bent as you bring the ball back. A tighter cocked position often adds velocity and control.",
        betterForm:
          'A strong load looks like a roughly right-angle bend at the elbow, with the ball up near your ear before you drive forward.',
      })
    } else {
      tips.push({
        id: 'load-elbow-good',
        severity: 'good',
        title: 'Good arm cock on your load',
        detail: 'You get a nice, tight bend in your elbow as you bring the ball back — a strong base for the throw.',
      })
    }
  }

  if (release?.elbow != null) {
    if (release.elbow < RELEASE_EXTENSION_TARGET) {
      tips.push({
        id: 'release-extension-watch',
        severity: 'watch',
        title: 'Extend your arm more at release',
        detail: "Your throwing arm isn't fully extended when the ball leaves your hand. Finishing straighter toward your target usually adds velocity and accuracy.",
        betterForm:
          'At the moment the ball leaves your hand, your arm should be close to fully extended toward your target — like reaching out to shake someone\'s hand.',
      })
    } else {
      tips.push({
        id: 'release-extension-good',
        severity: 'good',
        title: 'Good extension at release',
        detail: 'Your arm reaches a strong, full extension right as the ball leaves your hand.',
      })
    }
  }

  if (stride?.kneeBend != null) {
    if (stride.kneeBend > KNEE_BEND_THRESHOLD) {
      tips.push({
        id: 'stride-knee-watch',
        severity: 'watch',
        title: 'Soften your front leg on your stride',
        detail: 'Your front leg looks quite straight as your stride foot lands. A bit more flex there helps you transfer weight into the throw instead of losing power.',
        betterForm: 'A good stride lands with a slightly bent front knee that can absorb your weight and drive power up into the throw.',
      })
    } else {
      tips.push({
        id: 'stride-knee-good',
        severity: 'good',
        title: 'Good front-leg drive',
        detail: 'Your front knee has a nice bend when your stride foot lands — that helps you transfer power from your legs into the throw.',
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
        detail: 'You finish in a noticeably different body position than you started in. Try to keep your weight under control rather than falling off to one side.',
        betterForm:
          'Try finishing your throw balanced over your front leg, with your back foot able to come through naturally instead of falling away.',
      })
    } else {
      tips.push({
        id: 'balance-good',
        severity: 'good',
        title: 'Balanced start to finish',
        detail: 'Your body position at the end is close to where you started — a sign of good balance through your throw.',
      })
    }
  }

  if (tips.length === 0) {
    tips.push({
      id: 'no-signal',
      severity: 'info',
      title: "Couldn't get a clear read on your throw",
      detail: "We didn't detect your body clearly enough at key moments to give feedback. Try a well-lit video with your full body in frame, from your stance through your follow-through.",
    })
  }

  return tips
}
