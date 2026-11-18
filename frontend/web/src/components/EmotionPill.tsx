export function EmotionPill({ emotion }: { emotion: string }) {
  const normalized = emotion.toLowerCase()
  const kind = normalized.includes('happy') ? 'happy' : normalized.includes('sad') ? 'sad' : normalized.includes('angry') ? 'angry' : 'other'
  const icon = { happy:'☺', sad:'☹', angry:'☹', other:'◎' }[kind]
  return <span className={`emotion-pill emotion-${kind}`}><span aria-hidden>{icon}</span>{emotion}</span>
}
