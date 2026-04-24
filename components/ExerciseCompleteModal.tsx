'use client'

import { useEffect, useMemo } from 'react'
import type { ExerciseScore } from './VimEditor'

type Props = {
  score: ExerciseScore
  onClose: () => void
  onRetry: () => void
  nextHref: string | null
  nextTitle: string | null
}

type Grade = {
  label: string
  emojis: string[]
  messages: string[]
  color: string
}

const GRADES: { min: number; grade: Grade }[] = [
  {
    min: 90,
    grade: {
      label: 'Perfect',
      emojis: ['🎯', '🌟', '🏆'],
      messages: [
        '🔥 You nailed it! Vim wizard in training.',
        '⚡ Flawless execution. Muscle memory is kicking in!',
        '🌟 Near-optimal! You\'re thinking in vim.',
        '🏆 Perfection. You make Bram Moolenaar proud.',
      ],
      color: 'var(--tn-green)',
    },
  },
  {
    min: 75,
    grade: {
      label: 'Great work',
      emojis: ['✨', '💫', '🎉'],
      messages: [
        '💪 Strong run! A couple more tries and you\'ll nail it.',
        '🚀 Great work, efficiency is climbing.',
        '✨ Solid. Try to beat your time next.',
        '🎉 You\'re getting the hang of it!',
      ],
      color: 'var(--accent)',
    },
  },
  {
    min: 60,
    grade: {
      label: 'Well done',
      emojis: ['👍', '🌱', '💡'],
      messages: [
        '🌱 Nice, each run builds the muscle memory.',
        '💡 Good start. Can you do it in fewer keys?',
        '👌 You got it. Try a cleaner run next.',
        '📈 Progress! Efficiency is the next goal.',
      ],
      color: 'var(--text-primary)',
    },
  },
  {
    min: 0,
    grade: {
      label: 'Keep practicing',
      emojis: ['💪', '🌿', '🎓'],
      messages: [
        '🌿 Every expert started here. Keep going!',
        '🎓 Learning in progress, that\'s the point.',
        '💪 You completed it, that\'s the win. Try again!',
        '🔄 Muscle memory takes reps. You\'re building it.',
        '⭐ Getting through is half the battle. One more run?',
      ],
      color: 'var(--text-secondary)',
    },
  },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getGrade(score: number): Grade {
  for (const entry of GRADES) {
    if (score >= entry.min) return entry.grade
  }
  return GRADES[GRADES.length - 1].grade
}

function formatTime(ms: number): string {
  return (ms / 1000).toFixed(2) + 's'
}

export default function ExerciseCompleteModal({ score, onClose, onRetry, nextHref, nextTitle }: Props) {
  const grade = useMemo(() => getGrade(score.score), [score.score])
  const emoji = useMemo(() => pick(grade.emojis), [grade])
  const message = useMemo(() => pick(grade.messages), [grade])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-20 flex flex-col rounded-lg overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border)]">
        <button
          onClick={onClose}
          className="size-2.5 rounded-full bg-[var(--tn-red)] opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Close"
        />
        <span className="size-2.5 rounded-full bg-[var(--tn-orange)] opacity-70" />
        <span className="size-2.5 rounded-full bg-[var(--tn-green)] opacity-70" />
        <span className="flex-1 text-center font-mono text-xs text-[var(--text-secondary)]">Exercise Complete</span>
        <span className="w-[52px]" />
      </div>

      {/* Body */}
      <div className="flex-1 bg-[var(--bg-base)] flex flex-col justify-center px-8 py-6">
        {/* Grade label */}
        <p className="text-center font-mono text-lg font-semibold mb-4" style={{ color: grade.color }}>
          {grade.label} {emoji}
        </p>

        {/* Score row */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-sm text-[var(--text-secondary)]">Score</span>
          <span className="font-mono text-3xl font-bold text-[var(--text-primary)] tabular-nums">{score.score}</span>
        </div>

        <div className="border-t border-[var(--border)] mb-4" />

        {/* Metric rows */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm text-[var(--text-secondary)]">Efficiency</span>
            <span className="font-mono text-sm text-[var(--text-primary)] tabular-nums">
              {score.efficiency}%
              <span className="text-[var(--text-secondary)] ml-2">({score.keysUsed} / {score.idealKeys})</span>
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm text-[var(--text-secondary)]">Speed</span>
            <span className="font-mono text-sm text-[var(--text-primary)] tabular-nums">{score.speedScore}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm text-[var(--text-secondary)]">Time</span>
            <span className="font-mono text-sm text-[var(--text-primary)] tabular-nums">{formatTime(score.totalMs)}</span>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mb-4" />

        {/* Encouragement message */}
        <p className="font-mono text-sm text-[var(--text-secondary)] text-center mb-4 leading-relaxed">
          {message}
        </p>

        <div className="border-t border-[var(--border)] mb-4" />

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {nextHref && (
            <a
              href={nextHref}
              className="block text-center font-mono text-sm font-semibold px-4 py-2.5 rounded border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Next: {nextTitle}
            </a>
          )}
          <button
            onClick={onRetry}
            className="font-mono text-sm px-4 py-2.5 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
