type KeyBadgeProps = {
  keyName: string
  large?: boolean
}

export default function KeyBadge({ keyName, large }: KeyBadgeProps) {
  const isLabel = ['modes', 'operators', 'text objects', 'Review', 'Mega Review'].includes(keyName)

  if (isLabel) {
    return (
      <span className={`inline-flex items-center rounded-md bg-[var(--badge-bg)] px-3 py-1 font-mono text-[var(--text-muted)] ${large ? 'text-sm' : 'text-xs'}`}>
        {keyName}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md bg-[var(--bg-active)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono shadow-sm ${
        large
          ? 'px-3 py-1.5 text-base min-w-[2.5rem]'
          : 'px-2 py-0.5 text-sm min-w-[1.75rem]'
      }`}
    >
      {keyName}
    </span>
  )
}
