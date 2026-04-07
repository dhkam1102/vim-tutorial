import Link from 'next/link'
import { Lesson, Section } from '@/data/curriculum'
import KeyBadge from './KeyBadge'
import VimEditor from './VimEditor'

type Props = {
  section: Section
  lesson: Lesson
  prev: { sectionId: string; lessonId: string; title: string } | null
  next: { sectionId: string; lessonId: string; title: string } | null
}

function renderDescription(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-semibold font-mono">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function LessonContent({ section, lesson, prev, next }: Props) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      {/* Section label */}
      <p className="font-mono text-xs uppercase tracking-widest text-[#4ec9b0] mb-2">
        {section.title}
      </p>

      {/* Title + keys */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="font-mono text-2xl font-bold text-white">{lesson.title}</h1>
        <div className="flex gap-1.5 shrink-0 pt-1">
          {lesson.keys.map((k, i) => (
            <KeyBadge key={i} keyName={k} large />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="font-mono text-sm text-[#9aa0c0] leading-relaxed mb-8 p-4 bg-[#1e2436] rounded-lg border border-[#2e3450]">
        {renderDescription(lesson.description)}
      </div>

      {/* Interactive editor */}
      <div className="mb-10">
        <h2 className="font-mono text-sm font-semibold text-[#4ec9b0] uppercase tracking-widest mb-3">
          Practice
        </h2>
        <VimEditor
          initialText={lesson.exercise.initialText}
          instructions={lesson.exercise.instructions}
          hint={lesson.exercise.hint}
        />
      </div>

      {/* Prev / Next nav */}
      <div className="flex justify-between gap-4 border-t border-[#2e3450] pt-6">
        {prev ? (
          <Link
            href={`/lessons/${prev.sectionId}/${prev.lessonId}`}
            className="font-mono text-sm text-[#9aa0c0] hover:text-white transition-colors flex items-center gap-1"
          >
            ← {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/lessons/${next.sectionId}/${next.lessonId}`}
            className="font-mono text-sm text-[#9aa0c0] hover:text-white transition-colors flex items-center gap-1"
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
