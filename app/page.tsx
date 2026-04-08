import Link from 'next/link'
import { curriculum } from '@/data/curriculum'
import { getFirstLesson } from '@/lib/lessonUtils'

export default function Home() {
  const first = getFirstLesson()
  const totalLessons = curriculum.reduce((acc, s) => acc + s.lessons.length, 0)

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="font-mono text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
        VimTutor
      </h1>
      <p className="font-mono text-[var(--text-secondary)] text-lg mb-2 leading-relaxed">
        Learn vim interactively — practice real commands in your browser.
      </p>
      <p className="font-mono text-[var(--text-secondary)] text-sm mb-10">
        {curriculum.length} sections · {totalLessons} lessons
      </p>

      {first && (
        <Link
          href={`/lessons/${first.sectionId}/${first.lessonId}`}
          className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-mono font-semibold px-6 py-3 rounded-lg transition-colors mb-14"
        >
          Start Learning →
        </Link>
      )}

      <div className="space-y-6">
        {curriculum.map((section, i) => (
          <div key={section.id} className="border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="bg-[var(--bg-surface)] px-4 py-3 flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--border-subtle)] w-5">{i + 1}</span>
              <span className="font-mono text-sm font-semibold text-[var(--accent)]">{section.title}</span>
              <span className="font-mono text-xs text-[var(--border-subtle)] ml-auto">{section.lessons.length} lessons</span>
            </div>
            <ul>
              {section.lessons.map((lesson, j) => (
                <li key={lesson.id} className={j < section.lessons.length - 1 ? 'border-b border-[var(--border)]' : ''}>
                  <Link
                    href={`/lessons/${section.id}/${lesson.id}`}
                    className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    <span className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      {lesson.title}
                    </span>
                    <span className="flex gap-1 shrink-0">
                      {lesson.keys.slice(0, 3).map((k, ki) => (
                        <span
                          key={ki}
                          className="inline-flex items-center justify-center rounded bg-[var(--bg-active)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono text-xs px-1.5 py-0.5 min-w-[1.5rem]"
                        >
                          {k}
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
