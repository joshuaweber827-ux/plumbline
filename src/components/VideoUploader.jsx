import { useId } from 'react'
import './VideoUploader.css'

export function VideoUploader({ onFileSelected, hasVideo, activityLabel, icon }) {
  const inputId = useId()

  function handleChange(e) {
    const file = e.target.files?.[0]
    if (file) onFileSelected(file)
    e.target.value = ''
  }

  return (
    <div className="uploader">
      <label htmlFor={inputId} className="uploader-dropzone">
        <span className="uploader-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="uploader-title">{hasVideo ? `Swap ${activityLabel} video` : `Upload ${activityLabel} video`}</span>
        <span className="uploader-hint">MP4, MOV, or WebM — analyzed locally in your browser</span>
      </label>
      <input id={inputId} type="file" accept="video/*" onChange={handleChange} className="uploader-input" />
    </div>
  )
}
