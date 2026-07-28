// Continuous 0-100 "closeness to ideal form" curves shared by every sport's
// coaching tips, so the form score reflects how close each measurement is
// to a target rather than a simple pass/fail count.

// For "should stay near zero" deviations (posture drift, sway, tempo ratio
// distance from target, excess beyond a limit, etc). At deviation = 0 ->
// 100. At deviation = tolerance (the old watch/good boundary, in most
// checks) -> 50. At 2x tolerance -> 0.
export function closenessScore(deviation, tolerance) {
  if (tolerance <= 0) return 100
  const ratio = Math.abs(deviation) / tolerance
  return Math.round(Math.max(0, Math.min(100, 100 * (1 - ratio / 2))))
}

// For "should reach at least `target`" checks (e.g. arm extension). At
// value >= target -> 100 (no extra credit for overshooting). At
// value <= floor -> 0. Linear in between.
export function towardTargetScore(value, target, floor) {
  if (value == null) return null
  const ratio = (value - floor) / (target - floor)
  return Math.round(Math.max(0, Math.min(100, 100 * ratio)))
}

// For "should stay within [low, high]" checks. Score falls off linearly
// outside the range, reaching 0 once `tolerance` past the nearer edge.
export function withinRangeScore(value, low, high, tolerance) {
  if (value == null) return null
  if (value >= low && value <= high) return 100
  const distance = value < low ? low - value : value - high
  return Math.round(Math.max(0, Math.min(100, 100 * (1 - distance / tolerance))))
}
