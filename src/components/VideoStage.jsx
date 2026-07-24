import { forwardRef } from 'react'
import './VideoStage.css'

export const VideoStage = forwardRef(function VideoStage(
  {
    videoUrl,
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    poseCanvasRef,
    annotationCanvasRef,
    modelStatus,
    isPaused,
    aspectRatio,
  },
  videoRef,
) {
  return (
    <div className="video-stage">
      <div className="video-stage-frame" style={aspectRatio ? { aspectRatio } : undefined}>
        <video
          ref={videoRef}
          src={videoUrl}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onPlay={onPlay}
          onPause={onPause}
          className="video-stage-video"
          playsInline
        />
        <canvas ref={poseCanvasRef} className="video-stage-canvas video-stage-pose" />
        <canvas
          ref={annotationCanvasRef}
          className={`video-stage-canvas video-stage-annotation ${isPaused ? 'is-drawable' : ''}`}
        />
        {modelStatus === 'loading' && (
          <div className="video-stage-status">Loading MoveNet model…</div>
        )}
        {modelStatus === 'error' && (
          <div className="video-stage-status video-stage-status-error">
            Pose model failed to load. Check your connection and reload.
          </div>
        )}
      </div>
    </div>
  )
})
