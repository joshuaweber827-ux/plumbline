import { useEffect, useState } from 'react'
import { loadDetector } from '../lib/poseModel'

export function usePoseModel() {
  const [detector, setDetector] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    loadDetector()
      .then((d) => {
        if (cancelled) return
        setDetector(d)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { detector, status, error }
}
