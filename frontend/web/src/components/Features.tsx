const steps = [
  { num:'01', icon:'↥', title:'Provide an image', desc:'Use an existing image or capture a frame from your device camera.' },
  { num:'02', icon:'◎', title:'Detect & classify', desc:'MTCNN locates a face and the Vision Transformer classifies the facial expression.' },
  { num:'03', icon:'▤', title:'Review the output', desc:'Inspect the predicted expression and its model confidence in a dedicated result panel.' },
]
export function Features() { return <section id="how" className="how-section"><div className="container">
  <div className="section-heading"><div><p className="section-kicker">SYSTEM WORKFLOW / 03 STEPS</p><h2>Powerful analysis.<br/><span>Clear workflow.</span></h2></div><p>Three straightforward steps from facial image to an interpretable model prediction.</p></div>
  <div className="steps-grid">{steps.map(step => <article className="step-card" key={step.num}><div className="step-top"><span className="step-icon" aria-hidden="true">{step.icon}</span><span className="step-number">{step.num} / 03</span></div><h3>{step.title}</h3><p>{step.desc}</p><span className="step-line"/></article>)}</div>
  <p className="ethical-note"><strong>Interpretation note:</strong> A facial-expression prediction is not a reliable measure of a person’s actual emotional state. This application is an educational demonstration, not a diagnostic tool.</p>
</div></section> }
