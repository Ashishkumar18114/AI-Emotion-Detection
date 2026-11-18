import { useEffect, useRef, useState } from 'react'
import { detectEmotion } from '../lib/api'
import type { DetectSuccess } from '../lib/api'
import { EmotionPill } from './EmotionPill'

type Mode = 'camera' | 'upload'
type Props = { sectionRef: (el: HTMLElement | null) => void }
const maxSize = 10 * 1024 * 1024

function canvasFile(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob
    ? resolve(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' }))
    : reject(new Error('Could not capture a photo.')), 'image/jpeg', 0.92))
}

export function Detector({ sectionRef }: Props) {
  const [mode, setMode] = useState<Mode>('upload')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DetectSuccess | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const previewRef = useRef<string | null>(null)
  const cameraRequestRef = useRef(0)
  const requestRef = useRef(0)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => () => {
    cameraRequestRef.current++
    requestRef.current++
    streamRef.current?.getTracks().forEach(track => track.stop())
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
  }, [])

  function discardImage() {
    requestRef.current++
    setBusy(false)
    setImage(null); setResult(null); setError(null)
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = null
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }
  function stopCamera() {
    cameraRequestRef.current++
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStreaming(false)
  }
  function changeMode(next: Mode) {
    if (next === mode) return
    stopCamera(); discardImage(); requestRef.current++
    setBusy(false); setMode(next)
  }
  function setFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Please choose a valid image file.'); return }
    if (file.size > maxSize) { setError('Please choose an image smaller than 10 MB.'); return }
    discardImage()
    const url = URL.createObjectURL(file)
    previewRef.current = url
    setPreview(url); setImage(file)
  }
  async function startCamera() {
    setError(null); setResult(null)
    if (!navigator.mediaDevices?.getUserMedia) { setError('Camera access requires HTTPS or localhost and a compatible browser.'); return }
    stopCamera(); discardImage()
    const sequence = ++cameraRequestRef.current
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      if (sequence !== cameraRequestRef.current) { stream.getTracks().forEach(track => track.stop()); return }
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setStreaming(true)
    } catch (reason) {
      if (sequence === cameraRequestRef.current) setError(reason instanceof Error ? reason.message : 'Unable to access your camera.')
    }
  }
  async function capture() {
    if (!videoRef.current || !canvasRef.current || !streaming) return
    const video = videoRef.current, canvas = canvasRef.current
    if (!video.videoWidth || !video.videoHeight) { setError('The camera is not ready yet.'); return }
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) { setError('Camera capture is unavailable.'); return }
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0)
    try { const file = await canvasFile(canvas); stopCamera(); setFile(file) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Capture failed.') }
  }
  async function analyze() {
    if (!image || busy) return
    const sequence = ++requestRef.current
    setBusy(true); setError(null); setResult(null)
    try { const response = await detectEmotion(image); if (sequence === requestRef.current) setResult(response) }
    catch (reason) { if (sequence === requestRef.current) setError(reason instanceof Error ? reason.message : 'Analysis failed.') }
    finally { if (sequence === requestRef.current) setBusy(false) }
  }
  function reset() { requestRef.current++; setBusy(false); discardImage() }
  const confidence = result?.confidence === undefined ? null : Math.max(0, Math.min(100, Math.round(result.confidence * 100)))
  return <section id="studio" ref={sectionRef} className="studio-section"><div className="container">
    <div className="studio-heading"><div><p className="section-kicker"><span className="live-dot"/> INTERACTIVE WORKSPACE</p><h2>Detection <span>studio.</span></h2><p>Choose an input, analyze an expression, and see what the model predicts.</p></div><span className="studio-version">EMOTIQ / V1.0</span></div>
    <div className="studio-grid">
      <div className="studio-panel input-panel">
        <div className="panel-header"><div><span className="panel-index">01 / INPUT</span><h3>Image source</h3></div><span className="panel-status"><span className="live-dot"/> READY</span></div>
        <div className="mode-switch" role="group" aria-label="Choose image source"><button type="button" onClick={() => changeMode('upload')} className={mode === 'upload' ? 'selected' : ''} aria-pressed={mode === 'upload'}>↥ &nbsp; Upload image</button><button type="button" onClick={() => changeMode('camera')} className={mode === 'camera' ? 'selected' : ''} aria-pressed={mode === 'camera'}>◎ &nbsp; Use camera</button></div>
        <div className="image-stage">
          {mode === 'camera' && <video ref={videoRef} playsInline muted className={`camera-feed ${streaming ? 'visible' : ''}`} style={{ transform: 'scaleX(-1)' }} aria-label="Camera preview"/>}
          {preview && <img src={preview} className="stage-preview" alt="Selected image for expression analysis"/>}
          {!preview && !streaming && <div className="empty-stage"><div className="stage-symbol">{mode === 'upload' ? '↥' : '◎'}</div><strong>{mode === 'upload' ? 'Drop your image here' : 'Camera is off'}</strong><p>{mode === 'upload' ? 'Select or drop a photo to begin analysis' : 'Start the camera to capture a single frame'}</p></div>}
          {mode === 'upload' && !preview && <input ref={fileRef} className="stage-file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="Choose facial image" onChange={event => { const file = event.target.files?.[0]; if (file) setFile(file) }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if (file) setFile(file) }} />}
          <span className="stage-corner tl"/><span className="stage-corner tr"/><span className="stage-corner bl"/><span className="stage-corner br"/>
          <div className="stage-label">◉ &nbsp; {streaming ? 'CAMERA ACTIVE' : preview ? 'IMAGE LOADED' : 'AWAITING INPUT'}</div>
        </div>
        <div className="stage-actions">
          {mode === 'upload' && <label className="btn btn-outline choose-btn">{image ? 'Change image' : 'Browse files'} <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={event => { const file = event.target.files?.[0]; if (file) setFile(file); event.target.value = '' }}/></label>}
          {mode === 'camera' && (!streaming ? <button className="btn btn-outline" onClick={startCamera}>◎ Start camera</button> : <><button className="btn btn-outline" onClick={capture}>◉ Capture frame</button><button className="btn btn-quiet" onClick={stopCamera}>Stop camera</button></>)}
          {image && <button className="btn btn-quiet" onClick={reset}>Clear image</button>}
        </div>
        <button className="btn btn-primary analyze-btn" disabled={!image || busy} onClick={analyze}>{busy ? <><span className="spinner"/> Analyzing image...</> : <>✦ &nbsp; Analyze expression <span aria-hidden>↗</span></>}</button>
        <p className="input-hint">Images are sent to your configured Flask API for processing. Maximum file size: 10 MB.</p>
      </div>
      <aside className="studio-panel result-panel" aria-live="polite" aria-atomic="true">
        <div className="panel-header"><div><span className="panel-index">02 / OUTPUT</span><h3>Analysis result</h3></div><span className="panel-status">MODEL OUTPUT</span></div>
        {busy ? <div className="result-placeholder"><div className="result-orb loading">◎</div><h4>Analyzing your image</h4><p>The AI model is processing your selected photo.</p></div> : error ? <div className="result-placeholder error-state" role="alert"><div className="result-orb">!</div><h4>Unable to analyze</h4><p>{error}</p><button onClick={() => setError(null)} className="btn btn-quiet">Dismiss</button></div> : result ? <div className="result-content"><div className="prediction-label">PREDICTED EXPRESSION</div><div className="prediction-card"><div className="prediction-orb">{result.emotion.toLowerCase().includes('happy') ? '☺' : result.emotion.toLowerCase().includes('sad') ? '☹' : result.emotion.toLowerCase().includes('angry') ? '☹' : '◎'}</div><EmotionPill emotion={result.emotion}/></div>{confidence !== null && <div className="confidence-area"><div className="confidence-heading"><span>Model confidence</span><strong>{confidence}%</strong></div><div className="confidence-track"><div style={{ width: `${confidence}%` }}/></div><p>The score reflects the model’s confidence in this prediction, not certainty about a person's feelings.</p></div>}<button onClick={reset} className="btn btn-outline reset-btn">Analyze another image ↗</button></div> : <div className="result-placeholder"><div className="result-orb">◇</div><h4>Your result appears here</h4><p>Upload a photo or capture an image, then select “Analyze expression” to see the prediction.</p><div className="waiting-tags"><span>HAPPY</span><span>SAD</span><span>ANGRY</span></div></div>}
        <div className="result-bottom"><span>ENGINE</span><strong>ViT / PyTorch</strong><span>CLASSIFICATION</span><strong>3 classes</strong></div>
      </aside>
    </div>
  </div><canvas ref={canvasRef} hidden/></section>
}
