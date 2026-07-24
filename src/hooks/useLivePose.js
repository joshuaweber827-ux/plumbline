import { useEffect, useRef } from 'react'
import { drawSkeleton } from '../lib/skeleton'

// Runs pose detection tied to whatever frame the video is currently showing
// (playing, paused, or mid-scrub) and draws the skeleton onto the overlay
// canvas. Skips redundant work when the frame hasn't actually changed.
export function useLivePose({ videoRef, canvasRef, detector, onKeypoints, paused, mountTick }) {
  const lastTimeRef = useRef(-1)
  const onKeypointsRef = useRef(onKeypoints)
  onKeypointsRef.current = onKeypoints
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    if (!detector) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    let cancelled = false
    let raf

    async function tick() {
      if (cancelled) return
      const ctx = canvas.getContext('2d')

      if (!pausedRef.current && video.readyState >= 2 && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        if (video.currentTime !== lastTimeRef.current) {
          lastTimeRef.current = video.currentTime
          try {
            const poses = await detector.estimatePoses(video, { flipHorizontal: false })
            const keypoints = poses[0]?.keypoints ?? null
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            if (keypoints) drawSkeleton(ctx, keypoints)
            onKeypointsRef.current?.(keypoints)
          } catch {
            // Detector can throw if the video element becomes stale mid-seek; skip this frame.
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
    // mountTick forces a re-run once the video/canvas DOM nodes actually
    // exist — the ref objects themselves never change identity, so without
    // it this effect would only ever see the pre-upload (null) refs.
  }, [detector, videoRef, canvasRef, mountTick])
}
