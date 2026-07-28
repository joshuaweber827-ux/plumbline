import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VideoUploader } from './components/VideoUploader'
import { VideoStage } from './components/VideoStage'
import { PlaybackControls } from './components/PlaybackControls'
import { AnnotationControls } from './components/AnnotationControls'
import { LiveReadout } from './components/LiveReadout'
import { ResultsPanel } from './components/ResultsPanel'
import { CoachingPanel } from './components/CoachingPanel'
import { SportTabs } from './components/SportTabs'
import { usePoseModel } from './hooks/usePoseModel'
import { useLivePose } from './hooks/useLivePose'
import { useAnnotations } from './hooks/useAnnotations'
import { golfSport } from './sports/golf'
import { basketballSport } from './sports/basketball'
import { baseballSport } from './sports/baseball'
import { soccerSport } from './sports/soccer'
import { footballSport } from './sports/football'
import './App.css'

const SPORTS = [golfSport, basketballSport, baseballSport, soccerSport, footballSport]

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

  const [sport, setSport] = useState(golfSport)
  const [videoUrl, setVideoUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(null)
  const [currentKeypoints, setCurrentKeypoints] = useState(null)
  const [analysis, setAnalysis] = useState({ status: 'idle', progress: 0, checkpoints: null })

  const { detector, status: modelStatus } = usePoseModel()

  useEffect(() => {
    document.documentElement.dataset.sport = sport.id
  }, [sport])

  const { lines, undo, clear, canUndo } = useAnnotations({
    canvasRef: annotationCanvasRef,
    videoRef,
    mountTick,
  })

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
      clear()
    },
    [videoUrl, clear],
  )

  const handleSelectSport = useCallback(
    (nextSport) => {
      if (nextSport.id === sport.id) return
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      setSport(nextSport)
      setVideoUrl(null)
      setDuration(0)
      setCurrentTime(0)
      setIsPlaying(false)
      setAspectRatio(null)
      setCurrentKeypoints(null)
      setAnalysis({ status: 'idle', progress: 0, checkpoints: null })
      clear()
    },
    [sport, videoUrl, clear],
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
      const { checkpoints } = await sport.analyze(video, detector, {
        onProgress: (progress) => setAnalysis((prev) => ({ ...prev, progress })),
      })
      setAnalysis({ status: 'done', progress: 1, checkpoints })
    } finally {
      video.currentTime = wasTime
    }
  }, [detector, sport])

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

  const liveMetrics = useMemo(
    () =>
      sport.liveMetrics.map((metric) => ({
        label: metric.label,
        value: currentKeypoints ? metric.compute(currentKeypoints) : null,
      })),
    [currentKeypoints, sport],
  )

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-text">
          <h1 className="app-title">CoachCam</h1>
          <p className="app-subtitle">{sport.tagline}</p>
        </div>
        <SportTabs sports={SPORTS} activeId={sport.id} onSelect={handleSelectSport} />
      </header>

      <main className="app-main">
        <VideoUploader onFileSelected={handleFileSelected} hasVideo={!!videoUrl} activityLabel={sport.activityLabel} icon={sport.icon} />

        {videoUrl && (
          <div className="app-columns">
            <div className="app-player">
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

              <LiveReadout metrics={liveMetrics} detected={!!currentKeypoints} />

              <PlaybackControls
                videoRef={videoRef}
                duration={duration}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onSeek={handleSeek}
              />

              <AnnotationControls isPaused={!isPlaying} lineCount={lines.length} onUndo={undo} onClear={clear} canUndo={canUndo} />
            </div>

            <div className="app-analysis">
              <ResultsPanel
                status={analysis.status}
                progress={analysis.progress}
                checkpoints={analysis.checkpoints}
                onAnalyze={handleAnalyze}
                onSelectTime={handleSelectTime}
                canAnalyze={!!detector && duration > 0}
                checkpointDefs={sport.checkpointDefs}
                title={sport.checkpointsTitle}
                analyzeLabel={sport.analyzeLabel}
              />

              <CoachingPanel checkpoints={analysis.checkpoints} tipGenerator={sport.coach} title={sport.feedbackTitle} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
