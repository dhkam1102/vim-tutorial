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
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export default function Sidebar({ onCollapse }: { onCollapse?: () => void }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { fontSize, setFontSize, lineNumbers, setLineNumbers } = usePreferences()
  const { getStars } = useProgress()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <nav className="h-full flex flex-col">
      {/* Scrollable lesson list */}
      <div className="flex-1 overflow-y-auto py-6 px-2">
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-mono text-xl font-bold text-[var(--text-primary)] tracking-tight hover:text-[var(--accent)] transition-colors">
              VimTutor
            </Link>
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {curriculum.map((section) => (
            <div key={section.id}>
              <p className="px-2 mb-2 font-mono text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.lessons.map((lesson) => {
                  const href = `/lessons/${section.id}/${lesson.id}`
                  const isActive = pathname === href
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={href}
                        className={`flex items-center justify-between gap-2 rounded-md px-2 py-2 font-mono text-base transition-colors ${
                          isActive
                            ? 'bg-[var(--bg-active)] border-l-2 border-[var(--accent)] text-[var(--text-primary)] pl-[6px]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="truncate">{lesson.title}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          {(() => {
                            const stars = getStars(section.id, lesson.id)
                            if (stars !== null) {
                              return (
                                <span className="font-mono text-xs text-yellow-400">
                                  {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                                </span>
                              )
                            }
                            return lesson.keys.slice(0, 2).map((k, i) => (
                              <KeyBadge key={i} keyName={k} />
                            ))
                          })()}
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

      {/* Settings panel (expands above gear button) */}
      {settingsOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
            Preferences
          </p>
          <div className="space-y-3">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-[var(--text-secondary)]">Theme</span>
              <div className="flex items-center gap-1 bg-[var(--bg-active)] rounded-md p-0.5">
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`font-mono text-xs px-3 py-1 rounded capitalize transition-colors ${
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
              <div className="flex items-center gap-1 bg-[var(--bg-active)] rounded-md p-0.5">
                {([14, 16, 18] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`font-mono text-xs px-3 py-1 rounded transition-colors ${
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
              <div className="flex items-center gap-1 bg-[var(--bg-active)] rounded-md p-0.5">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setLineNumbers(v)}
                    className={`font-mono text-xs px-3 py-1 rounded transition-colors ${
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

      {/* Gear button — pinned at bottom */}
      <div className="border-t border-[var(--border)] px-4 py-3 shrink-0">
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className={`flex items-center gap-2 font-mono text-sm transition-colors ${
            settingsOpen
              ? 'text-[var(--accent)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
          aria-label="Preferences"
        >
          <GearIcon />
          <span>Preferences</span>
        </button>
      </div>
    </nav>
  )
}
