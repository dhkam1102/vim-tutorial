import Link from 'next/link'
import { curriculum } from '@/data/curriculum'
import { getFirstLesson } from '@/lib/lessonUtils'
import ProgressOverview from '@/components/ProgressOverview'
import HeroTyper from '@/components/HeroTyper'

export default function Home() {
  const first = getFirstLesson()
  const totalLessons = curriculum.reduce((acc, s) => acc + s.lessons.length, 0)

  return (
    <div className="max-w-4xl mx-auto py-14 px-6 md:px-10">
      {/* Terminal window chrome */}
      <div className="border border-[var(--border)] rounded-lg overflow-hidden mb-0">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border)]">
          <span className="size-2.5 rounded-full bg-[var(--tn-red)] opacity-70" />
          <span className="size-2.5 rounded-full bg-[var(--tn-orange)] opacity-70" />
          <span className="size-2.5 rounded-full bg-[var(--tn-green)] opacity-70" />
          <span className="flex-1 text-center font-mono text-xs text-[var(--text-secondary)]">vimTutorial</span>
          <span className="w-[52px]" />
        </div>

        {/* Terminal content */}
        <div className="px-6 md:px-10 py-10">
          {/* Hero */}
          <header className="mb-12">
            <p className="section-label mb-3 opacity-70">
              -- interactive terminal training
            </p>
            <HeroTyper />
            <p className="font-mono text-[var(--text-secondary)] text-sm opacity-60">
              {curriculum.length} sections&nbsp;&nbsp;·&nbsp;&nbsp;{totalLessons} lessons
            </p>
          </header>

          {/* CTA */}
          {first && (
            <div className="mb-14">
              <Link
                href={`/lessons/${first.sectionId}/${first.lessonId}`}
                className="inline-flex items-center gap-3 bg-[var(--bg-surface)] hover:bg-[var(--accent)] text-[var(--accent)] hover:text-[var(--accent-text)] font-mono font-bold px-7 py-3 rounded border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] hover:border-[var(--accent)] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
              >
                <span className="tracking-wide">Start Learning</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}

          {/* Divider */}
          <hr className="border-t border-[var(--border)] mb-12" />

          {/* Progress overview */}
          <ProgressOverview />
        </div>
      </div>
    </div>
  )
}
