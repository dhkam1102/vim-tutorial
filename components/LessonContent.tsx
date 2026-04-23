'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lesson, Section } from '@/data/curriculum'
import KeyBadge from './KeyBadge'
import VimEditor, { type ExerciseResult } from './VimEditor'
import DemoPlayer from './DemoPlayer'
import { useProgress } from '@/context/ProgressContext'

type Props = {
  section: Section
  lesson: Lesson
  prev: { sectionId: string; lessonId: string; title: string } | null
  next: { sectionId: string; lessonId: string; title: string } | null
}

function renderLine(text: string, key: number) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p key={key} className="leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="text-[var(--text-primary)] font-semibold font-mono">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}

function renderDescription(text: string) {
  const blocks = text.split('\n\n')
  return blocks.map((block, bi) => (
    <div key={bi} className={bi > 0 ? 'mt-4' : ''}>
      {block.split('\n').map((line, li) => renderLine(line, li))}
    </div>
  ))
}

function StarRating({ stars }: { stars: 1 | 2 | 3 | null }) {
  if (stars === null) return null
  return (
    <span className="inline-flex gap-0.5" aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`text-xl star-pop ${i <= stars ? 'star-filled' : 'star-empty'}`}
          style={{ animationDelay: `${(i - 1) * 0.08}s` }}
        >
          ★
        </span>
      ))}
    </span>
  )
}

export default function LessonContent({ section, lesson, prev, next }: Props) {
  const [hintsUsed, setHintsUsed] = useState(false)
  const [resetsUsed, setResetsUsed] = useState(false)
  const { recordCompletion, getStars } = useProgress()

  const stars = getStars(section.id, lesson.id)

  function handleComplete(result: ExerciseResult) {
    let earned: 1 | 2 | 3
    if (result.type === 'manual') {
      if (hintsUsed) earned = 1
      else if (resetsUsed) earned = 2
      else earned = 3
    } else {
      earned = result.stars
    }
    recordCompletion(section.id, lesson.id, earned)
  }

  return (
    <article className="max-w-3xl mx-auto py-10 px-6 md:px-10">
      {/* Breadcrumb label */}
      <p className="section-label mb-3" aria-label={`Section: ${section.title}`}>
        {section.title}
      </p>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <h1 className="font-mono text-3xl font-bold text-[var(--text-primary)] leading-tight">
          {lesson.title}
        </h1>
        <div className="flex items-center gap-3 shrink-0 pt-1">
          {stars !== null && <StarRating stars={stars} />}
          <div className="flex gap-1.5">
            {lesson.keys.map((k, i) => (
              <KeyBadge key={i} keyName={k} large />
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="font-mono text-sm text-[var(--text-secondary)] leading-[1.9] mb-10 p-5 bg-[var(--bg-surface)] rounded border border-[var(--border)]">
        {renderDescription(lesson.description)}
      </div>

      {/* Demo walkthrough */}
      {lesson.demo && <DemoPlayer steps={lesson.demo} />}

      {/* Practice editor */}
      <div className="mb-10">
        <VimEditor
          key={section.id + lesson.id}
          initialText={lesson.exercise.initialText}
          instructions={lesson.exercise.instructions}
          hint={lesson.exercise.hint}
          hints={lesson.exercise.hints}
          goal={lesson.exercise.goal}
          onComplete={handleComplete}
          onHintUsed={() => setHintsUsed(true)}
          onReset={() => setResetsUsed(true)}
        />
      </div>

      {/* Prev / Next nav */}
      <nav
        aria-label="Lesson navigation"
        className="flex justify-between gap-4 border-t border-[var(--border)] pt-6 mt-4"
      >
        {prev ? (
          <Link
            href={`/lessons/${prev.sectionId}/${prev.lessonId}`}
            className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            <span aria-hidden="true">←</span>
            <span className="truncate max-w-[200px]">{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/lessons/${next.sectionId}/${next.lessonId}`}
            className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            <span className="truncate max-w-[200px]">{next.title}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  )
}
