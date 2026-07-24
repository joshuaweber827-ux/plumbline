import { useCallback, useMemo, useRef, useState } from 'react'
import { VideoUploader } from './components/VideoUploader'
import { VideoStage } from './components/VideoStage'
import { PlaybackControls } from './components/PlaybackControls'
import { AnnotationControls } from './components/AnnotationControls'
import { LiveReadout } from './components/LiveReadout'
import { ResultsPanel } from './components/ResultsPanel'
import { CoachingPanel } from './components/CoachingPanel'
import { usePoseModel } from './hooks/usePoseModel'
import { useLivePose } from './hooks/useLivePose'
import { useAnnotations } from './hooks/useAnnotations'
import { analyzeSwing } from './lib/analyzeSwing'
import { spineTiltAngle, wristLineAngle } from './lib/angles'
import './App.css'

function App() {
  const videoRef = useRef(null)
  const poseCanvasRef = useRef(null)
  const annotationCanvasRef = useRef(null)

  // Refs don't change identity when their .current node mounts, so effects
  // that depend on "is the video/canvas actually in the DOM yet" (pose
  // detection, annotation drawing) need this counter bumped by real mounts
  // to know when to (re)attach.
  const [mountTick, setMountTick] = useState(0)
  const bumpMountTick = useCallback(() => setMountTick((n) => n + 1), [])
  const attachVideoRef = useCallback(
    (node) => {
      videoRef.current = node
      bumpMountTick()
    },
    [bumpMountTick],
  )
  const attachPoseCanvasRef = useCallback(
    (node) => {
      poseCanvasRef.current = node
      bumpMountTick()
    },
    [bumpMountTick],
  )
  const attachAnnotationCanvasRef = useCallback(
    (node) => {
      annotationCanvasRef.current = node
      bumpMountTick()
    },
    [bumpMountTick],
  )

  const [videoUrl, setVideoUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(null)
  const [currentKeypoints, setCurrentKeypoints] = useState(null)
  const [analysis, setAnalysis] = useState({ status: 'idle', progress: 0, checkpoints: null })

  const { detector, status: modelStatus } = usePoseModel()

  const handleFileSelected = useCallback(
    (file) => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      setVideoUrl(URL.createObjectURL(file))
      setDuration(0)
      setCurrentTime(0)
      setIsPlaying(false)
      setAspectRatio(null)
      setCurrentKeypoints(null)
      setAnalysis({ status: 'idle', progress: 0, checkpoints: null })
    },
    [videoUrl],
  )

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)
    setAspectRatio(video.videoWidth / video.videoHeight)
    if (annotationCanvasRef.current) {
      annotationCanvasRef.current.width = video.videoWidth
      annotationCanvasRef.current.height = video.videoHeight
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(videoRef.current?.currentTime ?? 0)
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }, [])

  const handleSeek = useCallback((time) => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = time
    setCurrentTime(time)
  }, [])

  const handleAnalyze = useCallback(async () => {
    const video = videoRef.current
    if (!video || !detector) return
    video.pause()
    const wasTime = video.currentTime
    setAnalysis({ status: 'analyzing', progress: 0, checkpoints: null })
    try {
      const { checkpoints } = await analyzeSwing(video, detector, {
        onProgress: (progress) => setAnalysis((prev) => ({ ...prev, progress })),
      })
      setAnalysis({ status: 'done', progress: 1, checkpoints })
    } finally {
      video.currentTime = wasTime
    }
  }, [detector])

  const handleSelectTime = useCallback((time) => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = time
    setCurrentTime(time)
  }, [])

  const onKeypoints = useCallback((keypoints) => {
    setCurrentKeypoints(keypoints)
  }, [])

  useLivePose({
    videoRef,
    canvasRef: poseCanvasRef,
    detector,
    onKeypoints,
    paused: analysis.status === 'analyzing',
    mountTick,
  })

  const { lines, undo, clear, canUndo } = useAnnotations({
    canvasRef: annotationCanvasRef,
    videoRef,
    mountTick,
  })

  const liveAngles = useMemo(() => {
    if (!currentKeypoints) return { spineTilt: null, swingPlane: null }
    return {
      spineTilt: spineTiltAngle(currentKeypoints),
      swingPlane: wristLineAngle(currentKeypoints),
    }
  }, [currentKeypoints])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">I love cyrus</h1>
        <p className="app-subtitle">Real pose-detection swing analysis, right in your browser</p>
      </header>

      <main className="app-main">
        <VideoUploader onFileSelected={handleFileSelected} hasVideo={!!videoUrl} />

        {videoUrl && (
          <>
            <VideoStage
              ref={attachVideoRef}
              videoUrl={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poseCanvasRef={attachPoseCanvasRef}
              annotationCanvasRef={attachAnnotationCanvasRef}
              modelStatus={modelStatus}
              isPaused={!isPlaying}
              aspectRatio={aspectRatio}
            />

            <LiveReadout spineTilt={liveAngles.spineTilt} swingPlane={liveAngles.swingPlane} detected={!!currentKeypoints} />

            <PlaybackControls
              videoRef={videoRef}
              duration={duration}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onSeek={handleSeek}
            />

            <AnnotationControls isPaused={!isPlaying} lineCount={lines.length} onUndo={undo} onClear={clear} canUndo={canUndo} />

            <ResultsPanel
              status={analysis.status}
              progress={analysis.progress}
              checkpoints={analysis.checkpoints}
              onAnalyze={handleAnalyze}
              onSelectTime={handleSelectTime}
              canAnalyze={!!detector && duration > 0}
            />

            <CoachingPanel checkpoints={analysis.checkpoints} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
