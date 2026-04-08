'use client'

import { createContext, useContext, useEffect, useState, startTransition } from 'react'
import { useSession } from 'next-auth/react'

type LessonProgress = {
  stars: 1 | 2 | 3
  completedAt: string
  hintsUsed: boolean
  resetsUsed: boolean
}

type ProgressMap = Record<string, LessonProgress>

type ProgressContextType = {
  progress: ProgressMap
  recordCompletion: (sectionId: string, lessonId: string, hintsUsed: boolean, resetsUsed: boolean) => void
  getStars: (sectionId: string, lessonId: string) => 1 | 2 | 3 | null
}

const ProgressContext = createContext<ProgressContextType | null>(null)

function calcStars(hintsUsed: boolean, resetsUsed: boolean): 1 | 2 | 3 {
  if (hintsUsed) return 1
  if (resetsUsed) return 2
  return 3
}

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
      .then((serverData: ProgressMap) => {
        setProgress((local) => {
          const merged = { ...local }
          for (const key of Object.keys(serverData)) {
            const srv = serverData[key]
            const loc = local[key]
            if (!loc || srv.stars > loc.stars) {
              merged[key] = srv
            }
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          return merged
        })
      })
      .catch(() => {})
  }, [session?.user?.id])

  function recordCompletion(sectionId: string, lessonId: string, hintsUsed: boolean, resetsUsed: boolean) {
    const key = `${sectionId}::${lessonId}`
    const newStars = calcStars(hintsUsed, resetsUsed)

    setProgress((prev) => {
      const existing = prev[key]
      if (existing && existing.stars >= newStars) return prev

      const entry: LessonProgress = {
        stars: newStars,
        completedAt: new Date().toISOString(),
        hintsUsed,
        resetsUsed,
      }
      const next = { ...prev, [key]: entry }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

      if (session?.user?.id) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId, lessonId, stars: newStars, hintsUsed, resetsUsed }),
        }).catch(() => {})
      }

      return next
    })
  }

  function getStars(sectionId: string, lessonId: string): 1 | 2 | 3 | null {
    const entry = progress[`${sectionId}::${lessonId}`]
    return entry ? entry.stars : null
  }

  return (
    <ProgressContext.Provider value={{ progress, recordCompletion, getStars }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
