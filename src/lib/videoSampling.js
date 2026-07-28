export function seekTo(video, time) {
  return new Promise((resolve) => {
    // Some browsers don't fire 'seeked' when the target time is already the
    // current position (e.g. sample 0 on a freshly loaded video), so this
    // also resolves on a short timeout to avoid hanging the whole analysis.
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      video.removeEventListener('seeked', onSeeked)
      clearTimeout(timer)
      resolve()
    }
    const onSeeked = () => finish()
    const timer = setTimeout(finish, 800)
    video.addEventListener('seeked', onSeeked)
    video.currentTime = time
  })
}

export function indexOfMin(list, selector) {
  let bestIndex = null
  let bestValue = Infinity
  list.forEach((item, i) => {
    const value = selector(item)
    if (value != null && value < bestValue) {
      bestValue = value
      bestIndex = i
    }
  })
  return bestIndex
}

export function indexOfMax(list, selector) {
  return indexOfMin(list, (item) => {
    const value = selector(item)
    return value == null ? null : -value
  })
}

export function median(values) {
  const valid = values.filter((v) => v != null)
  if (valid.length === 0) return null
  const sorted = [...valid].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function rangeOf(values) {
  const valid = values.filter((v) => v != null)
  if (valid.length === 0) return null
  return Math.max(...valid) - Math.min(...valid)
}
