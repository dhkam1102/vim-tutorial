'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lesson, Section } from '@/data/curriculum'
import KeyBadge from './KeyBadge'
import VimEditor from './VimEditor'
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

export default function LessonContent({ section, lesson, prev, next }: Props) {
  const [hintsUsed, setHintsUsed] = useState(false)
  const [resetsUsed, setResetsUsed] = useState(false)
  const { recordCompletion, getStars } = useProgress()

  const stars = getStars(section.id, lesson.id)

  function handleComplete() {
    recordCompletion(section.id, lesson.id, hintsUsed, resetsUsed)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-10">
      {/* Section label */}
      <p className="font-mono text-sm uppercase tracking-widest text-[var(--accent)] mb-3">
        {section.title}
      </p>

      {/* Title + keys */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <h1 className="font-mono text-3xl font-bold text-[var(--text-primary)]">{lesson.title}</h1>
        <div className="flex items-center gap-3 shrink-0 pt-1">
          {stars !== null && (
            <span className="font-mono text-lg text-yellow-400">
              {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
            </span>
          )}
          <div className="flex gap-2">
            {lesson.keys.map((k, i) => (
              <KeyBadge key={i} keyName={k} large />
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="font-mono text-base text-[var(--text-secondary)] leading-loose mb-10 p-6 bg-[var(--bg-surface)] rounded-lg border border-[var(--border)]">
        {renderDescription(lesson.description)}
      </div>

      {/* Demo walkthrough */}
      {lesson.demo && <DemoPlayer steps={lesson.demo} />}

      {/* Interactive editor */}
      <div className="mb-12">
        <h2 className="font-mono text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-4">
          Practice
        </h2>
        <VimEditor
          key={section.id + lesson.id}
          initialText={lesson.exercise.initialText}
          instructions={lesson.exercise.instructions}
          hint={lesson.exercise.hint}
          solution={lesson.exercise.solution}
          onComplete={handleComplete}
          onHintUsed={() => setHintsUsed(true)}
          onReset={() => setResetsUsed(true)}
        />
      </div>

      {/* Prev / Next nav */}
      <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-6">
        {prev ? (
          <Link
            href={`/lessons/${prev.sectionId}/${prev.lessonId}`}
            className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
          >
            ← {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/lessons/${next.sectionId}/${next.lessonId}`}
            className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
          >
            {next.title} →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
