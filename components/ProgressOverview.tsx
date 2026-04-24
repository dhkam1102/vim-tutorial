'use client'

import Link from 'next/link'
import { curriculum } from '@/data/curriculum'
import { useProgress } from '@/context/ProgressContext'

function SectionTrack({ section }: { section: typeof curriculum[0] }) {
  const { isCompleted } = useProgress()
  const total = section.lessons.length
  const completed = section.lessons.filter((l) => isCompleted(section.id, l.id)).length
  const pct = total > 0 ? completed / total : 0
  const isComplete = completed === total && total > 0

  return (
    <div className="group">
      {/* Section header row */}
      <div className="flex items-center justify-between mb-2 gap-3">
        <span
          className="section-label"
          style={{ opacity: isComplete ? 1 : 0.65 }}
        >
          {section.title}
        </span>
        <span className="font-mono text-xs text-[var(--text-secondary)] shrink-0 tabular-nums">
          {completed}/{total}
        </span>
      </div>

      {/* Track bar */}
      <div className="progress-track mb-2.5" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total} aria-label={`${section.title} progress`}>
        <div
          className={`progress-fill ${isComplete ? 'progress-fill-complete' : ''}`}
          style={{ '--fill-pct': pct } as React.CSSProperties}
        />
      </div>

      {/* Lesson dots */}
      <div className="flex flex-wrap gap-1">
        {section.lessons.map((lesson) => {
          const done = isCompleted(section.id, lesson.id)
          const href = `/lessons/${section.id}/${lesson.id}`
          return (
            <Link
              key={lesson.id}
              href={href}
              aria-label={`${lesson.title}${done ? ', completed' : ', not started'}`}
              className={`size-2 rounded-sm transition-transform hover:scale-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                done ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function ProgressOverview() {
  const { progress } = useProgress()

  const totalLessons = curriculum.reduce((acc, s) => acc + s.lessons.length, 0)
  const completedLessons = Object.keys(progress).length
  const globalPct = totalLessons > 0 ? completedLessons / totalLessons : 0
  const globalPctDisplay = Math.round(globalPct * 100)

  return (
    <section aria-label="Learning progress">
      {/* Global progress header */}
      <div className="flex items-baseline justify-between mb-4 gap-4">
        <h2 className="font-mono text-sm font-bold text-[var(--text-primary)]">
          Progress
        </h2>
        <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums">
          {completedLessons}/{totalLessons} lessons
          {globalPctDisplay > 0 && (
            <span className="ml-2 text-[var(--accent)]">{globalPctDisplay}%</span>
          )}
        </span>
      </div>

      {/* Global bar */}
      <div
        className="progress-track mb-8"
        role="progressbar"
        aria-valuenow={completedLessons}
        aria-valuemin={0}
        aria-valuemax={totalLessons}
        aria-label="Overall progress"
      >
        <div
          className={`progress-fill ${globalPct === 1 ? 'progress-fill-complete' : ''}`}
          style={{ '--fill-pct': globalPct } as React.CSSProperties}
        />
      </div>

      {/* Section tracks */}
      <div className="space-y-6">
        {curriculum.map((section) => (
          <SectionTrack key={section.id} section={section} />
        ))}
      </div>
    </section>
  )
}
