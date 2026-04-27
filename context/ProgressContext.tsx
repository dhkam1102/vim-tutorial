'use client'

import { createContext, useContext, useEffect, useState, startTransition } from 'react'
import { useSession } from 'next-auth/react'

type LessonProgress = {
  completedAt: string
}

type ProgressMap = Record<string, LessonProgress>

type ProgressContextType = {
  progress: ProgressMap
  recordCompletion: (sectionId: string, lessonId: string) => void
  clearCompletion: (sectionId: string, lessonId: string) => void
  isCompleted: (sectionId: string, lessonId: string) => boolean
}

const ProgressContext = createContext<ProgressContextType | null>(null)

const STORAGE_KEY = 'vim-progress'
const MIGRATION_V1_KEY = 'vim-progress-migrated-v1'
const MIGRATION_V2_KEY = 'vim-progress-migrated-v2'

const PROGRESS_KEY_MIGRATION_V1: Record<string, string> = {
  'insert-like-a-pro::insert-at-line-ends': 'basic-vim::insert-at-line-ends',
  'insert-like-a-pro::opening-new-lines': 'basic-vim::opening-new-lines',
  'insert-like-a-pro::making-small-edits': 'basic-vim::making-small-edits',
  'essential-motions::moving-by-words': 'basic-operators::moving-by-words',
  'essential-motions::moving-to-line-ends': 'advanced-vertical-movement::moving-to-line-ends',
  'basic-operators::delete-lines': 'advanced-vertical-movement::delete-lines',
  'basic-operators::delete-multiple-lines': 'advanced-vertical-movement::delete-multiple-lines',
  'advanced-vertical-movement::relative-line-jumps': 'essential-motions::relative-line-jumps',
  'advanced-vertical-movement::paragraph-jumps': 'advanced-navigation::paragraph-jumps',
  'advanced-vertical-movement::window-scrolls': 'advanced-navigation::window-scrolls',
  'text-objects-brackets::intro-to-text-objects': 'text-objects::intro-to-text-objects',
  'text-objects-brackets::delete-inside-brackets': 'text-objects::delete-inside-brackets',
  'text-objects-brackets::delete-around-brackets': 'text-objects::delete-around-brackets',
  'text-objects-brackets::change-inside-brackets': 'text-objects::change-inside-brackets',
  'text-objects-brackets::change-around-brackets': 'text-objects::change-around-brackets',
  'text-objects-brackets::brackets-review': 'text-objects::brackets-review',
  'text-objects-quotes::delete-inside-quotes': 'text-objects::delete-inside-quotes',
  'text-objects-quotes::delete-around-quotes': 'text-objects::delete-around-quotes',
  'text-objects-quotes::change-inside-quotes': 'text-objects::change-inside-quotes',
  'text-objects-quotes::change-around-quotes': 'text-objects::change-around-quotes',
  'text-objects-words::delete-inside-word': 'text-objects::delete-inside-word',
  'text-objects-words::delete-around-word': 'text-objects::delete-around-word',
  'text-objects-words::change-inside-word': 'text-objects::change-inside-word',
  'text-objects-paragraphs::delete-inside-paragraph': 'text-objects::delete-inside-paragraph',
  'text-objects-paragraphs::delete-around-paragraph': 'text-objects::delete-around-paragraph',
  'text-objects-paragraphs::change-inside-paragraph': 'text-objects::change-inside-paragraph',
}

const PROGRESS_KEY_MIGRATION_V2: Record<string, string> = {
  'basic-operators::moving-by-words': 'core-editing::moving-by-words',
  'basic-operators::intro-to-operators': 'core-editing::intro-to-operators',
  'basic-operators::delete-words': 'core-editing::delete-words',
  'basic-operators::change-words': 'core-editing::change-words',
  'basic-operators::copy-paste-lines': 'core-editing::copy-paste-lines',
  'advanced-vertical-movement::moving-to-line-ends': 'line-control::moving-to-line-ends',
  'advanced-vertical-movement::absolute-line-jumps': 'line-control::absolute-line-jumps',
  'advanced-vertical-movement::delete-lines': 'line-control::delete-lines',
  'advanced-vertical-movement::delete-multiple-lines': 'line-control::delete-multiple-lines',
  'essential-motions::find-character': 'precise-movement::find-character',
  'essential-motions::till-character': 'precise-movement::till-character',
  'essential-motions::relative-line-jumps': 'precise-movement::relative-line-jumps',
}

function applyMigration(data: ProgressMap, map: Record<string, string>): ProgressMap {
  const migrated: ProgressMap = {}
  for (const [key, value] of Object.entries(data)) {
    const newKey = map[key] ?? key
    if (!migrated[newKey]) migrated[newKey] = value
  }
  return migrated
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({})
  const { data: session } = useSession()

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        let data: ProgressMap = JSON.parse(raw)
        let changed = false
        if (!localStorage.getItem(MIGRATION_V1_KEY)) {
          data = applyMigration(data, PROGRESS_KEY_MIGRATION_V1)
          localStorage.setItem(MIGRATION_V1_KEY, '1')
          changed = true
        }
        if (!localStorage.getItem(MIGRATION_V2_KEY)) {
          data = applyMigration(data, PROGRESS_KEY_MIGRATION_V2)
          localStorage.setItem(MIGRATION_V2_KEY, '1')
          changed = true
        }
        if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setProgress(data)
      } catch {}
    })
  }, [])

  // Sync from server when user logs in
  useEffect(() => {
    if (!session?.user?.id) return
    fetch('/api/progress')
      .then((r) => r.json())
      .then((serverData: Record<string, unknown>) => {
        setProgress((local) => {
          const merged = { ...local }
          for (const key of Object.keys(serverData)) {
            if (!merged[key]) {
              merged[key] = { completedAt: new Date().toISOString() }
            }
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          return merged
        })
      })
      .catch(() => {})
  }, [session?.user?.id])

  function recordCompletion(sectionId: string, lessonId: string) {
    const key = `${sectionId}::${lessonId}`

    setProgress((prev) => {
      if (prev[key]) return prev

      const entry: LessonProgress = { completedAt: new Date().toISOString() }
      const next = { ...prev, [key]: entry }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

      if (session?.user?.id) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId, lessonId, stars: 1, hintsUsed: false, resetsUsed: false }),
        }).catch(() => {})
      }

      return next
    })
  }

  function clearCompletion(sectionId: string, lessonId: string) {
    const key = `${sectionId}::${lessonId}`
    setProgress((prev) => {
      const next = { ...prev }
      delete next[key]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (session?.user?.id) {
        fetch('/api/progress', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId, lessonId }),
        }).catch(() => {})
      }
      return next
    })
  }

  function isCompleted(sectionId: string, lessonId: string): boolean {
    return !!progress[`${sectionId}::${lessonId}`]
  }

  return (
    <ProgressContext.Provider value={{ progress, recordCompletion, clearCompletion, isCompleted }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
