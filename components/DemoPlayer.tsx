'use client'

import { useState } from 'react'
import { DemoStep } from '@/data/curriculum'

type Props = {
  steps: DemoStep[]
}

function renderLine(
  lineText: string,
  lineIdx: number,
  cursorLine: number,
  cursorCol: number,
  mode: DemoStep['mode']
) {
  if (lineIdx !== cursorLine) {
    return (
      <div key={lineIdx} className="leading-7">
        {lineText || '\u00A0'}
      </div>
    )
  }

  const before = lineText.slice(0, cursorCol)
  const cursorChar = lineText[cursorCol] ?? ' '
  const after = lineText.slice(cursorCol + 1)

  return (
    <div key={lineIdx} className="leading-7">
      <span>{before}</span>
      {mode === 'INSERT' ? (
        <>
          <span className="border-l-2 border-[var(--accent)] demo-cursor" />
          <span>{cursorChar}</span>
        </>
      ) : mode === 'VISUAL' ? (
        <span className="bg-purple-500 text-white">{cursorChar}</span>
      ) : (
        <span className="bg-[var(--accent)] text-[var(--accent-text)]">{cursorChar}</span>
      )}
      <span>{after}</span>
    </div>
  )
}

export default function DemoPlayer({ steps }: Props) {
  const [idx, setIdx] = useState(0)
  const step = steps[idx]
  const lines = step.text.split('\n')
  const [cursorLine, cursorCol] = step.cursor

  const modeLabel = step.mode === 'INSERT' ? 'EDIT' : step.mode === 'VISUAL' ? 'SELECT' : 'NAV'
  const modeColor =
    step.mode === 'INSERT'
      ? 'bg-[var(--accent)] text-[var(--accent-text)]'
      : step.mode === 'VISUAL'
      ? 'bg-purple-500 text-white'
      : 'bg-[var(--bg-active)] text-[var(--text-secondary)]'

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden mb-10">

      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border)]">
        <span className="size-2.5 rounded-full bg-[var(--tn-red)] opacity-70" />
        <span className="size-2.5 rounded-full bg-[var(--tn-orange)] opacity-70" />
        <span className="size-2.5 rounded-full bg-[var(--tn-green)] opacity-70" />
        <span className="flex-1 text-center font-mono text-xs text-[var(--text-secondary)]">Demo</span>
        <span className="w-[52px]" />
      </div>

      {/* Command sequence bar */}
      <div className="bg-[var(--bg-surface)] px-4 py-3 border-b border-[var(--border)] flex items-center gap-2 flex-wrap">
        <span className="section-label mr-1">Demo</span>
        {steps.map((s, i) => {
          const label = s.mode === 'INSERT' ? 'EDIT' : s.mode === 'VISUAL' ? 'SELECT' : 'NAV'
          const labelColor = s.mode === 'INSERT' ? 'text-[var(--accent)]' : s.mode === 'VISUAL' ? 'text-purple-400' : 'text-[var(--text-secondary)]'
          return (
            <button key={i} onClick={() => setIdx(i)} className="flex items-center gap-2">
              {i > 0 && <span className="text-[var(--border-subtle)] text-xs">→</span>}
              <div className="flex flex-col items-center gap-0.5">
                {s.key ? (
                  <kbd className={`keycap px-2 py-0.5 font-mono text-xs ${
                    i === idx
                      ? '!bg-[var(--accent)] !text-[var(--accent-text)] !border-[var(--accent)]'
                      : ''
                  }`}>
                    {s.key}
                  </kbd>
                ) : (
                  <span className={`font-mono text-xs ${
                    i === idx ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                  }`}>●</span>
                )}
                <span className={`font-mono text-[10px] leading-none ${i === idx ? labelColor : 'text-[var(--text-secondary)] opacity-50'}`}>
                  {label}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Fake editor — fixed height so nav buttons don't move */}
      <div className="bg-[var(--bg-base)] flex text-sm font-mono h-36 overflow-hidden">
        <div className="select-none text-right pr-4 pl-3 py-4 text-[var(--text-secondary)] opacity-40 border-r border-[var(--border)] min-w-[3rem]">
          {lines.map((_, i) => (
            <div key={i} className="leading-7">{i + 1}</div>
          ))}
        </div>
        <div className="px-4 py-4 flex-1 text-[var(--text-primary)]">
          {lines.map((line, i) => renderLine(line, i, cursorLine, cursorCol, step.mode))}
        </div>
      </div>

      {/* Mode bar + description — fixed height */}
      <div className="bg-[var(--bg-base)] px-4 py-2 border-t border-[var(--border)] flex items-center justify-between h-11">
        <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${modeColor}`}>
          {modeLabel}
        </span>
        <p className="font-mono text-xs text-[var(--text-secondary)] truncate ml-4">
          {step.description}
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-[var(--bg-surface)] border-t border-[var(--border)] px-4 py-3 flex items-center justify-end gap-2">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="font-mono text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <button
          onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
          disabled={idx === steps.length - 1}
          className="font-mono text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
