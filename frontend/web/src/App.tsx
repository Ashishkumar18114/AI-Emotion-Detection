import { useRef } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Detector } from './components/Detector'
import { Footer } from './components/Footer'

export default function App() {
  const detectorRef = useRef<HTMLElement | null>(null)
  const goToDetector = () => detectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return <div className="site-shell">
    <Navbar onTryNow={goToDetector} />
    <main>
      <Hero onTryNow={goToDetector} />
      <Detector sectionRef={el => { detectorRef.current = el }} />
      <Features />
    </main>
    <Footer />
  </div>
}
