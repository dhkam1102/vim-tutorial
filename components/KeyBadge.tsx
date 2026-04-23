type KeyBadgeProps = {
  keyName: string
  large?: boolean
}

export default function KeyBadge({ keyName, large }: KeyBadgeProps) {
  const isLabel = ['modes', 'operators', 'text objects', 'Review', 'Mega Review'].includes(keyName)

  if (isLabel) {
    return (
      <span
        className={`inline-flex items-center rounded bg-[var(--badge-bg)] border border-[var(--border-subtle)] px-3 py-1 font-mono font-medium tracking-wide text-[var(--text-muted)] ${
          large ? 'text-sm' : 'text-xs'
        }`}
      >
        {keyName}
      </span>
    )
  }

  return (
    <span
      className={`keycap ${
        large
          ? 'px-3 py-1.5 text-base min-w-[2.5rem]'
          : 'px-2 py-0.5 text-sm min-w-[1.75rem]'
      }`}
    >
      {keyName}
    </span>
  )
}
