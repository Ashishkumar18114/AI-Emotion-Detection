type Props = { onTryNow: () => void }
export function Hero({ onTryNow }: Props) {
  return <section className="hero container" id="home">
    <div className="hero-copy">
      <div className="eyebrow"><span className="live-dot"/> COMPUTER VISION Â· AI-POWERED ANALYSIS</div>
      <h1>Understanding emotions, <em>one expression</em> at a time.</h1>
      <p className="hero-lead">Discover how artificial intelligence interprets facial expressions. Capture a frame or upload an image to explore emotion recognition in seconds.</p>
      <div className="hero-actions"><button className="btn btn-primary btn-large" onClick={onTryNow}>Try emotion detection <span aria-hidden>â†—</span></button><a className="btn btn-quiet btn-large" href="#how">Explore the technology <span aria-hidden>â†“</span></a></div>
      <div className="hero-details"><span><strong>03</strong> emotion categories</span><span className="detail-separator"/><span><strong>ViT</strong> model architecture</span><span className="detail-separator"/><span><strong>02</strong> input methods</span></div>
    </div>
    <div className="hero-visual" aria-label="Illustration of an AI facial-expression analysis interface">
      <div className="visual-glow"/><div className="hero-visual-top"><span><span className="live-dot"/> VISION MODULE</span><span>DEMO INTERFACE / 01</span></div>
      <div className="hero-image-frame"><img src="/emotion.png" alt="Facial emotion recognition concept"/><div className="face-corners" aria-hidden><i/><i/><i/><i/></div><div className="hero-scan-line"/></div>
      <div className="visual-bottom"><div><small>RECOGNITION ENGINE</small><strong>Vision Transformer</strong></div><span className="visual-chip">â— SYSTEM READY</span></div>
      <div className="floating-tag">âœ¦ &nbsp; Facial expression analysis</div>
    </div>
  </section>
}

