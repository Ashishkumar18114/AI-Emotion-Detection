type Props = { onTryNow: () => void }
export function Hero({ onTryNow }: Props) {
  return <section className="hero container" id="home">
    <div className="hero-copy">
      <div className="eyebrow"><span className="live-dot"/> COMPUTER VISION PLATFORM <span className="eyebrow-divider"/> IMAGE-BASED AI</div>
      <h1>Facial expression <span className="gradient-text">analysis,</span><br/> made intuitive.</h1>
      <p className="hero-lead">A focused computer vision workspace for exploring facial expressions. Upload a photo or capture a camera frame, then review the model’s prediction and confidence in one place.</p>
      <div className="hero-actions"><button className="btn btn-primary btn-large" onClick={onTryNow}>Launch analysis studio <span aria-hidden="true">↗</span></button><a className="btn btn-outline btn-large" href="#how">See how it works <span aria-hidden="true">↓</span></a></div>
      <div className="hero-details"><span><strong>03</strong> Expression classes</span><span className="detail-separator"/><span><strong>ViT</strong> Classification engine</span><span className="detail-separator"/><span><strong>02</strong> Input modes</span></div>
      <div className="hero-footnote"><span className="hero-footnote-dot"/> Designed for educational computer vision demonstrations</div>
    </div>
    <div className="hero-visual" aria-label="Illustrative computer vision analysis interface">
      <div className="hero-visual-top"><span><span className="live-dot"/> COMPUTER VISION / PREVIEW</span><span className="hero-visual-id">MODULE 01 — DEMO</span></div>
      <div className="hero-image-frame"><img src="/emotion.png" alt="Sample image illustrating facial expression analysis"/><div className="hero-image-overlay"/><div className="face-corners" aria-hidden="true"><i/><i/><i/><i/></div><div className="hero-scan-line"/><span className="image-coordinate top-left">ROI · FACE</span><span className="image-coordinate bottom-right">224 × 224 INPUT</span></div>
      <div className="visual-bottom"><div><small>ARCHITECTURE</small><strong>Vision Transformer</strong></div><div><small>INPUT TYPES</small><strong>Camera / Upload</strong></div><span className="visual-chip"><span className="live-dot"/> UI READY</span></div>
      <div className="floating-tag"><span className="floating-icon">⌁</span><span><strong>Expression intelligence</strong><small>Image-based classification</small></span></div>
    </div>
  </section>
}
