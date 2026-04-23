'use client'

import { useState, useEffect } from 'react'

const TITLE = 'VimTutor'
const SUBTITLE = 'Master Vim through hands-on practice — real commands, real feedback, in your browser.'

type Phase = 'title' | 'subtitle' | 'done'

export default function HeroTyper() {
  const [phase, setPhase] = useState<Phase>('title')
  const [titleChars, setTitleChars] = useState(0)
  const [subtitleChars, setSubtitleChars] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTitleChars(TITLE.length)
      setSubtitleChars(SUBTITLE.length)
      setPhase('done')
      return
    }

    if (phase === 'title') {
      if (titleChars < TITLE.length) {
        const t = setTimeout(() => setTitleChars((n) => n + 1), 90)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('subtitle'), 260)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'subtitle') {
      if (subtitleChars < SUBTITLE.length) {
        const t = setTimeout(() => setSubtitleChars((n) => n + 1), 15)
        return () => clearTimeout(t)
      } else {
        setPhase('done')
      }
    }
  }, [phase, titleChars, subtitleChars])

  const titleDone = titleChars >= TITLE.length
  const subtitleDone = phase === 'done'

  return (
    <>
      <h1 className={`font-mono text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight${subtitleDone ? ' crt-cursor' : ''}`}>
        {TITLE.slice(0, titleChars)}
        {!titleDone && <span className="crt-cursor" />}
      </h1>
      {(phase === 'subtitle' || phase === 'done') && (
        <p className="font-mono text-[var(--text-secondary)] text-base mb-1 leading-relaxed">
          {SUBTITLE.slice(0, subtitleChars)}
          {!subtitleDone && <span className="crt-cursor" />}
        </p>
      )}
    </>
  )
}
