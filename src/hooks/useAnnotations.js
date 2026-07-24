import { useCallback, useEffect, useRef, useState } from 'react'

// Lets the user click-and-drag on the paused video to draw reference lines.
// Lines are stored in normalized (0-1) coordinates so they redraw correctly
// at any canvas size.
export function useAnnotations({ canvasRef, videoRef, mountTick }) {
  const [lines, setLines] = useState([])
  const drawingRef = useRef(null)

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#cbb88b'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.setLineDash([8, 6])

    const allLines = drawingRef.current ? [...lines, drawingRef.current] : lines
    for (const line of allLines) {
      ctx.beginPath()
      ctx.moveTo(line.x1 * canvas.width, line.y1 * canvas.height)
      ctx.lineTo(line.x2 * canvas.width, line.y2 * canvas.height)
      ctx.stroke()
    }
  }, [canvasRef, lines])

  useEffect(() => {
    redraw()
  }, [redraw, mountTick])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function toNormalized(e) {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    function onPointerDown(e) {
      const video = videoRef.current
      if (!video || !video.paused) return
      const { x, y } = toNormalized(e)
      drawingRef.current = { x1: x, y1: y, x2: x, y2: y }
      canvas.setPointerCapture(e.pointerId)
    }

    function onPointerMove(e) {
      if (!drawingRef.current) return
      const { x, y } = toNormalized(e)
      drawingRef.current = { ...drawingRef.current, x2: x, y2: y }
      redraw()
    }

    function onPointerUp() {
      if (!drawingRef.current) return
      const line = drawingRef.current
      drawingRef.current = null
      const dx = line.x2 - line.x1
      const dy = line.y2 - line.y1
      if (Math.hypot(dx, dy) > 0.01) {
        setLines((prev) => [...prev, line])
      } else {
        redraw()
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
    }
    // mountTick forces a re-run once the canvas DOM node actually exists —
    // the ref object itself never changes identity, so without it this
    // effect would only ever see the pre-upload (null) ref.
  }, [canvasRef, videoRef, redraw, mountTick])

  const undo = useCallback(() => {
    setLines((prev) => prev.slice(0, -1))
  }, [])

  const clear = useCallback(() => {
    setLines([])
  }, [])

  return { lines, undo, clear, canUndo: lines.length > 0 }
}
