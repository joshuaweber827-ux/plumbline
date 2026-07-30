// Makes sure feedback always pairs criticism with at least one genuine
// strength to build on. If every check came back "watch," this finds
// whichever one came closest to passing (smallest deviation-to-threshold
// ratio) and reframes just that one as an encouraging "closest to solid"
// note instead of a plain critique, rather than leaving the panel
// all-critical when nothing is fully locked in yet.
export function ensureOneStrength(tips, watchCandidates) {
  const hasGood = tips.some((tip) => tip.severity === 'good')
  if (hasGood || watchCandidates.length === 0) return tips

  const best = watchCandidates.reduce((a, b) => (b.ratio < a.ratio ? b : a))
  return tips
    .filter((tip) => tip.id !== best.id)
    .concat({
      id: `${best.id}-closest`,
      severity: 'good',
      title: best.closeTitle,
      detail: best.closeDetail,
    })
}
