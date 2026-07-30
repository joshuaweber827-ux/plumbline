// A curated Q&A knowledge base with simple keyword matching — not a live
// AI. Good enough for common "how do I get better" questions, honest about
// its limits for anything more specific.
export const KNOWLEDGE_BASE = [
  {
    id: 'practice-frequency',
    question: 'How often should I practice?',
    keywords: ['practice', 'often', 'frequency', 'how much', 'train', 'training'],
    answer:
      "Most athletes improve fastest with frequent, shorter sessions rather than occasional long ones — aim for consistent practice several times a week, with enough rest between hard sessions to recover. Quality reps focused on one specific thing (like a single checkpoint from your video analysis) beat unfocused volume.",
  },
  {
    id: 'warm-up',
    question: 'How should I warm up?',
    keywords: ['warm up', 'warmup', 'before i', 'stretch before'],
    answer:
      "A good warm-up raises your heart rate and loosens the specific muscles you're about to use — a few minutes of light cardio, dynamic stretches (leg swings, arm circles), and a handful of slow practice reps of your actual movement before going full speed.",
  },
  {
    id: 'rest',
    question: 'How important is rest and recovery?',
    keywords: ['rest', 'recovery', 'sore', 'overtraining', 'rest day', 'burnout'],
    answer:
      'Very — your body actually adapts and gets stronger during rest, not during the workout itself. Build in rest days, prioritize sleep, and back off if you feel persistently sore or fatigued instead of pushing through.',
  },
  {
    id: 'nutrition',
    question: 'Does nutrition matter?',
    keywords: ['nutrition', 'eat', 'diet', 'food', 'protein'],
    answer:
      "Yes — consistent meals with enough protein and carbohydrates fuel both performance and recovery. You don't need anything fancy: regular balanced meals and staying hydrated go a long way before worrying about supplements.",
  },
  {
    id: 'sleep',
    question: 'How much sleep do I need?',
    keywords: ['sleep', 'tired'],
    answer:
      "Most teen and young-adult athletes perform and recover noticeably better with 8+ hours of sleep — it's one of the most underrated performance tools available.",
  },
  {
    id: 'mental',
    question: 'How do I stay focused or handle nerves?',
    keywords: ['mental', 'focus', 'nervous', 'pressure', 'confidence', 'anxious', 'choke'],
    answer:
      "Break the skill into the same small checkpoints you'd analyze on video — thinking about one specific cue (like \"finish balanced\") is easier under pressure than trying to fix everything at once. Visualizing your form in slow motion beforehand helps too.",
  },
  {
    id: 'injury',
    question: 'How do I avoid injury?',
    keywords: ['injury', 'hurt', 'pain', 'prevent', 'safe'],
    answer:
      "Warm up properly, don't skip rest days, and progress gradually rather than jumping straight to max effort. Persistent pain (not just normal muscle soreness) is a sign to stop and, if it continues, see a doctor or athletic trainer rather than pushing through.",
  },
  {
    id: 'strength',
    question: 'Should I lift weights?',
    keywords: ['strength', 'weights', 'lifting', 'gym', 'lift'],
    answer:
      "Basic strength training (bodyweight or light weights, good form) supports almost every sport by building a more stable, powerful base — it doesn't need to be sport-specific to help.",
  },
  {
    id: 'flexibility',
    question: 'Should I stretch?',
    keywords: ['flexibility', 'stretch', 'mobility', 'flexible'],
    answer:
      'Dynamic stretching (moving stretches) before activity and static stretching (holding a stretch) afterward both help — more mobility generally means more usable range of motion in your swing, throw, or kick.',
  },
  {
    id: 'why-video',
    question: 'Why record and watch my own video?',
    keywords: ['video', 'record', 'film myself', 'analyze', 'watch myself', 'why record'],
    answer:
      'Seeing your actual form (rather than how it feels) is one of the fastest ways to improve — that\'s exactly what this app is for. Try uploading a clip on one of the sport tabs to get real checkpoints and feedback.',
  },
  {
    id: 'beginner',
    question: "I'm just starting out — what should I focus on first?",
    keywords: ['beginner', 'new to', 'just starting', 'getting started', 'first time'],
    answer:
      'Nail the fundamentals of setup and balance before worrying about power or speed — most technique issues later on trace back to a rushed or inconsistent starting position. Slow, correct reps beat fast, sloppy ones early on.',
  },
  {
    id: 'track-progress',
    question: 'How do I actually track improvement?',
    keywords: ['track', 'progress', 'improve', 'improvement', 'measure'],
    answer:
      'Pick one specific thing to work on at a time (not five), and check back on it with fresh video every week or two rather than judging by feel alone — small measurable changes add up.',
  },
  {
    id: 'coach',
    question: 'Do I need a coach?',
    keywords: ['coach', 'lesson', 'instructor'],
    answer:
      "A coach helps, but isn't required to make real progress — this app's real pose tracking is designed to give you some of that same objective feedback for free. Occasional access to a coach for the trickiest parts of your technique is still valuable if you can get it.",
  },
  {
    id: 'balance',
    question: 'Why does balance matter so much?',
    keywords: ['balance', 'stability', 'stable'],
    answer:
      "Nearly every sport skill — the golf swing, a jump shot, a kick, a throw — starts and ends with balance. If your base isn't stable, power and accuracy both suffer, which is why \"balance from start to finish\" shows up as a check across every sport in this app.",
  },
  {
    id: 'consistency',
    question: 'How do I make my technique more consistent?',
    keywords: ['consistency', 'consistent', 'repeat', 'repeatable'],
    answer:
      'Repetition of the SAME correct motion is what builds consistency — that\'s why isolating one checkpoint at a time (rather than trying to fix everything simultaneously) tends to work better than broad, unfocused practice.',
  },
  {
    id: 'golf-swing',
    question: 'How do I improve my golf swing?',
    keywords: ['golf swing', 'golf', 'backswing', 'tempo'],
    answer:
      'Two of the biggest levers are tempo (a smooth ~3:1 backswing-to-downswing rhythm) and holding your posture from setup through impact — both are things the Golf tab measures directly from your video.',
  },
  {
    id: 'basketball-shot',
    question: 'How do I improve my jump shot?',
    keywords: ['jump shot', 'basketball', 'shoot', 'shooting', 'free throw'],
    answer:
      'Focus on full arm extension at release and a consistent elbow angle at your set point — those two things do more for shooting consistency than raw strength. Bending your knees on the load lets your legs (not just your arm) power the shot.',
  },
  {
    id: 'baseball-hitting',
    question: 'How do I hit the ball harder?',
    keywords: ['baseball', 'hitting', 'batting', 'hit the ball', 'bat speed'],
    answer:
      'Power mostly comes from hip-shoulder separation (coiling your shoulders back while your hips stay quieter) and driving through the ball with full arm extension at contact — not just arm strength.',
  },
  {
    id: 'soccer-kick',
    question: 'How do I kick more powerfully and accurately?',
    keywords: ['soccer', 'kick', 'kicking'],
    answer:
      'Plant-foot balance and hip rotation through the ball matter more than leg speed alone — a stable plant leg and hips that open up toward the target add both power and accuracy.',
  },
  {
    id: 'football-throw',
    question: 'How do I throw a more accurate pass?',
    keywords: ['football', 'throw', 'throwing', 'quarterback', 'spiral', 'pass'],
    answer:
      'A tight elbow cock on your load and full arm extension at release are the two biggest form factors — plus a stride that transfers your weight forward instead of staying flat-footed.',
  },
  {
    id: 'filming-tips',
    question: 'How should I film myself for the best results?',
    keywords: ['film', 'filming', 'camera', 'recording tips', 'how to record'],
    answer:
      'Get your whole body in frame from a side angle if possible, use good lighting, and keep the camera steady — the pose tracking works best when your joints are clearly visible throughout the whole motion.',
  },
  {
    id: 'how-it-works',
    question: 'How does this app actually give feedback?',
    keywords: ['how does this work', 'how does the app', 'pose detection', 'how do you'],
    answer:
      'It runs a real pose-detection model in your browser to track your joints frame by frame, calculates real angles from that (like elbow bend or spine tilt), and compares them to well-known technique fundamentals — see the "What the Feedback Is Based On" box on the Home tab for the full breakdown.',
  },
  {
    id: 'greeting',
    question: 'Hello!',
    keywords: ['hello', 'hi there', 'hey there', 'hiya'],
    answer: "Hey! Ask me anything about training, recovery, or getting better at golf, basketball, baseball, soccer, or football.",
  },
  {
    id: 'thanks',
    question: 'Thanks!',
    keywords: ['thanks', 'thank you', 'appreciate'],
    answer: "You're welcome — good luck out there!",
  },
]

export const SUGGESTED_QUESTIONS = [
  'How often should I practice?',
  'How do I avoid injury?',
  'Why does balance matter so much?',
  'How do I improve my golf swing?',
  'How do I improve my jump shot?',
]

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Scores every entry by how many of its keywords appear in the input
// (longer phrase matches count for more), and returns the best match —
// or null if nothing scored above zero.
export function findAnswer(userText) {
  const input = normalize(userText)
  if (!input) return null

  let best = null
  let bestScore = 0
  for (const entry of KNOWLEDGE_BASE) {
    let score = 0
    for (const keyword of entry.keywords) {
      if (input.includes(keyword)) score += keyword.split(' ').length
    }
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  return bestScore > 0 ? best : null
}
