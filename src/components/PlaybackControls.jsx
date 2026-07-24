import './PlaybackControls.css'

const FRAME_DURATION = 1 / 30

export function PlaybackControls({ videoRef, duration, currentTime, isPlaying, onTogglePlay, onSeek }) {
  const disabled = !duration

  function stepFrame(direction) {
    const video = videoRef.current
    if (!video) return
    video.pause()
    const next = Math.min(Math.max(video.currentTime + direction * FRAME_DURATION, 0), duration)
    video.currentTime = next
  }

  return (
    <div className="playback-controls">
      <div className="playback-buttons">
        <button type="button" onClick={onTogglePlay} disabled={disabled} className="playback-btn playback-btn-play">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button type="button" onClick={() => stepFrame(-1)} disabled={disabled} className="playback-btn">
          ◀ −1 frame
        </button>
        <button type="button" onClick={() => stepFrame(1)} disabled={disabled} className="playback-btn">
          +1 frame ▶
        </button>
      </div>

      <div className="playback-seek">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={FRAME_DURATION}
          value={Math.min(currentTime, duration || 0)}
          disabled={disabled}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="playback-seek-bar"
          aria-label="Scrub video"
        />
        <span className="playback-time mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00.0'
  const m = Math.floor(seconds / 60)
  const s = seconds - m * 60
  return `${m}:${s.toFixed(1).padStart(4, '0')}`
}
