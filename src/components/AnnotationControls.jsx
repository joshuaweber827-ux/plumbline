import './AnnotationControls.css'

export function AnnotationControls({ isPaused, lineCount, onUndo, onClear, canUndo }) {
  return (
    <div className="annotation-controls">
      <span className="annotation-hint">
        {isPaused
          ? 'Click and drag on the video to draw a reference line'
          : 'Pause the video to draw reference lines'}
      </span>
      <div className="annotation-buttons">
        <span className="annotation-count mono">{lineCount} line{lineCount === 1 ? '' : 's'}</span>
        <button type="button" onClick={onUndo} disabled={!canUndo} className="annotation-btn">
          Undo
        </button>
        <button type="button" onClick={onClear} disabled={!canUndo} className="annotation-btn">
          Clear
        </button>
      </div>
    </div>
  )
}
