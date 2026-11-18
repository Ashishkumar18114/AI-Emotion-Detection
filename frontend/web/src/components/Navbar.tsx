import { useState } from 'react'
import { Brand } from './Brand'

type Props = { onTryNow: () => void }
export function Navbar({ onTryNow }: Props) {
  const [open, setOpen] = useState(false)
  return <header className="nav-wrap">
    <nav className="nav container" aria-label="Main navigation">
      <a href="#home" className="brand" onClick={() => setOpen(false)} aria-label="AI Emotion Detection — Home"><Brand /></a>
      <button type="button" className="mobile-menu" aria-expanded={open} aria-controls="nav-links" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(v => !v)}>{open ? '✕' : '☰'}</button>
      <div id="nav-links" className={`nav-links ${open ? 'expanded' : ''}`}>
        <a href="#home" onClick={() => setOpen(false)}>Overview</a>
        <a href="#studio" onClick={() => setOpen(false)}>Analysis studio</a>
        <a href="#how" onClick={() => setOpen(false)}>Workflow</a>
      </div>
      <button className="btn btn-primary nav-cta" onClick={() => { setOpen(false); onTryNow() }}>Open workspace <span aria-hidden="true">↗</span></button>
    </nav>
  </header>
}
