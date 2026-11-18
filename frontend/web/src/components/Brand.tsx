export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className={`identity ${compact ? 'identity-compact' : ''}`}>
    <span className="identity-symbol" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" role="presentation"><path d="M15 7H9a2 2 0 0 0-2 2v6m26-8h6a2 2 0 0 1 2 2v6M7 33v6a2 2 0 0 0 2 2h6m26-8v6a2 2 0 0 1-2 2h-6" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round"/><path d="M14 24c4-5 16-5 20 0-4 5-16 5-20 0Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><circle cx="24" cy="24" r="4.3" fill="currentColor"/><path d="M16 15c2-2 5-3 8-3s6 1 8 3M16 33c2 2 5 3 8 3s6-1 8-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".55"/></svg>
    </span>
    <span className="identity-copy"><strong>AI Emotion <span>Detection</span></strong><small>FACIAL EXPRESSION INTELLIGENCE</small></span>
  </span>
}
