const RELEASE_EXTENSION_TARGET = 165
const SETPOINT_ELBOW_LOW = 70
const SETPOINT_ELBOW_HIGH = 110
const KNEE_BEND_THRESHOLD = 165
const BALANCE_THRESHOLD = 10

// Release extension uses a fixed target (near-full-extension reads as
// roughly straight from most camera angles), which is more reliable with a
// single uncalibrated camera than a precise mid-range angle target. The
// rest compare the player's own checkpoints against each other.
export function generateShotCoachingTips(checkpoints) {
  if (!checkpoints) return []
  const { stance, load, setPoint, release, balance } = checkpoints
  const tips = []

  if (release?.elbow != null) {
    if (release.elbow < RELEASE_EXTENSION_TARGET) {
      tips.push({
        id: 'release-extension-watch',
        severity: 'watch',
        title: 'Straighten your arm more at release',
        detail: "Your shooting arm isn't fully extended when the ball leaves your hand. Finishing straighter usually adds consistency and range.",
        betterForm:
          'At the moment the ball leaves your hand, your shooting arm should look almost fully straight, wrist relaxed and pointing down toward the basket ("reach into the cookie jar").',
      })
    } else {
      tips.push({
        id: 'release-extension-good',
        severity: 'good',
        title: 'Full extension at release',
        detail: 'Your arm reaches a nice, full extension right as the ball leaves your hand.',
      })
    }
  }

  if (load?.kneeBend != null) {
    if (load.kneeBend > KNEE_BEND_THRESHOLD) {
      tips.push({
        id: 'knee-bend-watch',
        severity: 'watch',
        title: 'Use your legs more',
        detail: 'Your knees stay fairly straight before you shoot. Bending them more lets your legs help power the shot instead of just your arm.',
        betterForm: 'A good load looks like a quarter-to-half squat — bent enough that you could jump straight up from that position.',
      })
    } else {
      tips.push({
        id: 'knee-bend-good',
        severity: 'good',
        title: 'Good leg drive',
        detail: 'You get a solid bend in your knees before rising into the shot — that helps generate power from your legs.',
      })
    }
  }

  if (setPoint?.elbow != null) {
    if (setPoint.elbow < SETPOINT_ELBOW_LOW || setPoint.elbow > SETPOINT_ELBOW_HIGH) {
      tips.push({
        id: 'setpoint-elbow-watch',
        severity: 'watch',
        title: 'Check your elbow bend before you shoot',
        detail: 'Many shooters aim for roughly a right angle at the elbow before pushing the ball up. Yours looks noticeably more or less bent than that.',
        betterForm:
          "At the set point, many shooters cock the elbow to roughly 90°, like holding a waiter's tray at shoulder height, before extending straight up and out.",
      })
    } else {
      tips.push({
        id: 'setpoint-elbow-good',
        severity: 'good',
        title: 'Good elbow bend before you shoot',
        detail: 'Your elbow sits in a solid range at the set point before you push the ball up.',
      })
    }
  }

  if (stance?.spineTilt != null && balance?.spineTilt != null) {
    const delta = Math.abs(balance.spineTilt - stance.spineTilt)
    if (delta > BALANCE_THRESHOLD) {
      tips.push({
        id: 'balance-watch',
        severity: 'watch',
        title: 'Work on landing balanced',
        detail: 'You finish in a noticeably different body position than you started in. Try to land in about the same spot you jumped from.',
        betterForm:
          'Good shooters often land in close to the same footprint they jumped from — try freezing your follow-through and checking if you’re still balanced over your feet.',
      })
    } else {
      tips.push({
        id: 'balance-good',
        severity: 'good',
        title: 'Balanced start to finish',
        detail: "Your body position at the end is close to where you started — a sign of good balance through the shot.",
      })
    }
  }

  if (tips.length === 0) {
    tips.push({
      id: 'no-signal',
      severity: 'info',
      title: "Couldn't get a clear read on your shot",
      detail: "We didn't detect your body clearly enough at key moments to give feedback. Try a well-lit video with your full body in frame, from your stance through your follow-through.",
    })
  }

  return tips
}
