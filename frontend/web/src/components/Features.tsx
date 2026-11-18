const steps = [
  { num:'01', icon:'▧', title:'Provide an image', desc:'Upload a facial photograph, or capture a single frame with your device camera.' },
  { num:'02', icon:'◎', title:'AI analyzes the face', desc:'The backend locates a face and uses a Vision Transformer to classify its expression.' },
  { num:'03', icon:'◈', title:'Explore the result', desc:'See the predicted emotion and the model’s confidence score in a clear result panel.' },
]
export function Features() { return <section id="how" className="how-section"><div className="container">
  <div className="section-heading"><div><p className="section-kicker">THE PROCESS</p><h2>Complex intelligence.<br/><span>Simple experience.</span></h2></div><p>From an image to an interpretable prediction in three straightforward steps.</p></div>
  <div className="steps-grid">{steps.map(step => <article className="step-card" key={step.num}><div className="step-top"><span className="step-icon">{step.icon}</span><span className="step-number">{step.num} / 03</span></div><h3>{step.title}</h3><p>{step.desc}</p></article>)}</div>
  <p className="ethical-note">A facial-expression prediction is not a reliable measure of a person’s internal emotional state. This application is an educational demonstration.</p>
</div></section> }
