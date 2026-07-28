// Derives a 1-100 form score from the same coaching tips shown in the
// feedback panel, rather than a separate scoring formula — the score is
// just "what fraction of checks came back good," so it stays consistent
// with (and explainable by) the strengths/focus-areas breakdown below it.
export function scoreFromTips(tips) {
  const scored = tips.filter((tip) => tip.severity === 'good' || tip.severity === 'watch')
  if (scored.length === 0) return null

  const goodCount = scored.filter((tip) => tip.severity === 'good').length
  const watchCount = scored.length - goodCount
  const score = Math.max(1, Math.min(100, Math.round((goodCount / scored.length) * 100)))

  return { score, goodCount, watchCount, total: scored.length }
}
