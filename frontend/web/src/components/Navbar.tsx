import { useState } from 'react'

type Props = { onTryNow: () => void }
export function Navbar({ onTryNow }: Props) {
  const [open, setOpen] = useState(false)
  return <header className="nav-wrap">
    <nav className="nav container" aria-label="Main navigation">
      <a href="#home" className="brand" onClick={() => setOpen(false)}><span className="brand-mark">â—ˆ</span><span>EMOT<span className="brand-accent">IQ</span><small>VISION INTELLIGENCE</small></span></a>
      <button className="mobile-menu" aria-expanded={open} aria-controls="nav-links" aria-label="Toggle navigation" onClick={() => setOpen(v => !v)}>â˜°</button>
      <div id="nav-links" className={`nav-links ${open ? 'expanded' : ''}`}>
        <a href="#home" onClick={() => setOpen(false)}>Home</a>
        <a href="#studio" onClick={() => setOpen(false)}>Detection studio</a>
        <a href="#how" onClick={() => setOpen(false)}>How it works</a>
      </div>
      <button className="btn btn-primary nav-cta" onClick={() => { setOpen(false); onTryNow() }}>Launch studio <span aria-hidden>â†—</span></button>
    </nav>
  </header>
}

