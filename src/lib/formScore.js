// Derives a 1-100 form score by averaging each coaching tip's
// scoreContribution — a continuous measure of how close that specific
// dimension (posture, extension, tempo, etc.) is to ideal form, not a
// pass/fail count. This keeps the number consistent with (and explainable
// by) the strengths/focus-areas breakdown shown below it, since it's built
// from the exact same per-check comparisons.
export function scoreFromTips(tips) {
  const scored = tips.filter((tip) => typeof tip.scoreContribution === 'number')
  if (scored.length === 0) return null

  const goodCount = scored.filter((tip) => tip.severity === 'good').length
  const sum = scored.reduce((total, tip) => total + tip.scoreContribution, 0)
  const score = Math.max(1, Math.min(100, Math.round(sum / scored.length)))

  return { score, goodCount, total: scored.length }
}
