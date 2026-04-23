'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { curriculum } from '@/data/curriculum'
import { useTheme } from '@/context/ThemeContext'
import { usePreferences } from '@/context/PreferencesContext'
import { useProgress } from '@/context/ProgressContext'
import KeyBadge from './KeyBadge'
import UserWidget from './UserWidget'

function GearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function StarsDisplay({ stars, small = false }: { stars: 1 | 2 | 3; small?: boolean }) {
  return (
    <span className={`inline-flex gap-0.5 ${small ? 'text-xs' : 'text-sm'}`} aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= stars ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  )
}

export default function Sidebar({ onCollapse }: { onCollapse?: () => void }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { fontSize, setFontSize, lineNumbers, setLineNumbers } = usePreferences()
  const { getStars } = useProgress()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <nav className="h-full flex flex-col" aria-label="Lesson navigation">
      {/* Scrollable lesson list */}
      <div className="flex-1 overflow-y-auto py-5 px-2">
        {/* Wordmark */}
        <div className="mb-5 px-2 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-[var(--text-primary)] tracking-tight hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            VimTutor
          </Link>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-5">
          {curriculum.map((section, si) => (
            <div key={section.id} className="phosphor-in" style={{ animationDelay: `${si * 0.04}s` }}>
              {/* Section heading */}
              <h2 id={`section-${section.id}`} className="section-label px-2 mb-1.5">
                {section.title}
              </h2>
              <ul className="space-y-px" aria-labelledby={`section-${section.id}`}>
                {section.lessons.map((lesson, li) => {
                  const href = `/lessons/${section.id}/${lesson.id}`
                  const isActive = pathname === href
                  const stars = getStars(section.id, lesson.id)
                  return (
                    <li key={lesson.id} className="fade-up" style={{ animationDelay: `${(si * 4 + li) * 0.015}s` }}>
                      <Link
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center justify-between gap-2 rounded px-2 py-1.5 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                          isActive
                            ? 'lesson-active pl-[6px]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="truncate">{lesson.title}</span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          {stars !== null && <StarsDisplay stars={stars} small />}
                          {lesson.keys.slice(0, 2).map((k, i) => (
                            <KeyBadge key={i} keyName={k} />
                          ))}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <div id="preferences-panel" className="border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4" role="region" aria-label="Preferences">
          <p className="section-label mb-3">Preferences</p>
          <div className="space-y-3">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-[var(--text-secondary)]">Theme</span>
              <div className="flex items-center gap-0.5 bg-[var(--bg-active)] rounded p-0.5" role="group" aria-label="Choose theme">
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    aria-pressed={theme === t}
                    className={`font-mono text-xs px-3 py-1 rounded capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      theme === t
                        ? 'bg-[var(--accent)] text-[var(--accent-text)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-[var(--text-secondary)]">Font size</span>
              <div className="flex items-center gap-0.5 bg-[var(--bg-active)] rounded p-0.5" role="group" aria-label="Choose font size">
                {([14, 16, 18] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    aria-pressed={fontSize === s}
                    className={`font-mono text-xs px-3 py-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      fontSize === s
                        ? 'bg-[var(--accent)] text-[var(--accent-text)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Line numbers */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-[var(--text-secondary)]">Line numbers</span>
              <div className="flex items-center gap-0.5 bg-[var(--bg-active)] rounded p-0.5" role="group" aria-label="Toggle line numbers">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setLineNumbers(v)}
                    aria-pressed={lineNumbers === v}
                    className={`font-mono text-xs px-3 py-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      lineNumbers === v
                        ? 'bg-[var(--accent)] text-[var(--accent-text)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {v ? 'On' : 'Off'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User widget */}
      <UserWidget />

      {/* Gear button */}
      <div className="border-t border-[var(--border)] px-4 py-3 shrink-0">
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          aria-expanded={settingsOpen}
          aria-controls="preferences-panel"
          className={`flex items-center gap-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded ${
            settingsOpen
              ? 'text-[var(--accent)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <GearIcon />
          <span>Preferences</span>
        </button>
      </div>
    </nav>
  )
}
