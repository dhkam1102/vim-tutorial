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
  isCompleted: (sectionId: string, lessonId: string) => boolean
}

const ProgressContext = createContext<ProgressContextType | null>(null)

const STORAGE_KEY = 'vim-progress'

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({})
  const { data: session } = useSession()

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) setProgress(JSON.parse(raw))
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

  function isCompleted(sectionId: string, lessonId: string): boolean {
    return !!progress[`${sectionId}::${lessonId}`]
  }

  return (
    <ProgressContext.Provider value={{ progress, recordCompletion, isCompleted }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
