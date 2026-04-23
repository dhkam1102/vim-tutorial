'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EditorState, StateField, StateEffect, RangeSet } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine, Decoration, DecorationSet } from '@codemirror/view'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'
import { vim, getCM } from '@replit/codemirror-vim'
import { oneDark } from '@codemirror/theme-one-dark'
import { python } from '@codemirror/lang-python'
import { useTheme } from '@/context/ThemeContext'
import { usePreferences, EDITOR_HEIGHT_MAP } from '@/context/PreferencesContext'
import type { ExerciseGoal } from '@/data/curriculum'

export type { ExerciseGoal }

export type ExerciseResult =
  | { type: 'navigation'; stars: 1 | 2 | 3 }
  | { type: 'mode'; stars: 1 | 2 | 3 }
  | { type: 'edit'; stars: 1 | 2 | 3 }
  | { type: 'multi'; stars: 1 | 2 | 3 }
  | { type: 'manual' }

const setTargetEffect = StateEffect.define<number>()
const MS_PER_IDEAL_KEY = 900
const BLOCKED_NAV_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'])

function isSubsequence(seq: string[], hist: string[]): boolean {
  let si = 0
  for (let hi = 0; hi < hist.length && si < seq.length; hi++) {
    if (hist[hi] === seq[si]) si++
  }
  return si === seq.length
}

function computeStars(
  actualKeystrokes: number,
  idealKeystrokes: number,
  totalMs: number,
  hintTier: number,
  resetUsed: boolean,
): 1 | 2 | 3 {
  if (actualKeystrokes === 0) return 1
  const keystrokeEff = Math.min(1, idealKeystrokes / actualKeystrokes)
  const idealMs = idealKeystrokes * MS_PER_IDEAL_KEY
  const timeEff = Math.min(1, idealMs / Math.max(totalMs, 1))
  const score = keystrokeEff * 0.7 + timeEff * 0.3
  const rawStars: 1 | 2 | 3 = score >= 0.85 ? 3 : score >= 0.60 ? 2 : 1
  let capped: 1 | 2 | 3 = rawStars
  if (resetUsed) capped = Math.min(capped, 2) as 1 | 2
  if (hintTier >= 3) capped = 1
  else if (hintTier === 2) capped = Math.min(capped, 2) as 1 | 2
  // tier 1 = nudge, no cap
  return capped
}

type VimEditorProps = {
  initialText: string
  instructions: string
  hint?: string
  hints?: string[]
  goal?: ExerciseGoal
  onComplete?: (result: ExerciseResult) => void
  onHintUsed?: () => void
  onReset?: () => void
}

type VimModeLabel = 'NORMAL' | 'INSERT' | 'VISUAL' | 'VISUAL_LINE'

function readVimMode(view: EditorView): VimModeLabel | null {
  const cm = getCM(view)
  const vs = cm?.state.vim
  if (!vs) return null
  if (vs.insertMode) return 'INSERT'
  if (vs.visualMode) {
    const lineWise = (vs as unknown as { visualLine?: boolean }).visualLine
    return lineWise ? 'VISUAL_LINE' : 'VISUAL'
  }
  return 'NORMAL'
}

export default function VimEditor({
  initialText,
  instructions,
  hint,
  hints,
  goal,
  onComplete,
  onHintUsed,
  onReset,
}: VimEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const completedRef = useRef(false)
  const hintTierRef = useRef(0)
  const resetUsedRef = useRef(false)
  const modeHistoryRef = useRef<string[]>([])

  const currentTargetIdxRef = useRef(0)
  const segmentKeystrokesRef = useRef(0)
  const totalActualRef = useRef(0)
  const totalIdealRef = useRef(0)
  const segmentStartRef = useRef(Date.now())
  const totalTimeRef = useRef(0)

  const modeRepsRef = useRef(0)
  const totalKeystrokesRef = useRef(0)
  const startTimeRef = useRef(Date.now())

  const currentStepIdxRef = useRef(0)

  // Tier list — hints[] takes precedence, falls back to single hint
  const hintTiers: string[] = hints && hints.length ? hints : hint ? [hint] : []

  const [showHint, setShowHint] = useState(false)
  const [hintTier, setHintTier] = useState(0)
  const [modeLabel, setModeLabel] = useState('NAV')
  const [completed, setCompleted] = useState(false)
  const [targetsHit, setTargetsHit] = useState(0)
  const [modeRepsDisplay, setModeRepsDisplay] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [gradeLabel, setGradeLabel] = useState<string | null>(null)

  const { theme } = useTheme()
  const { editorHeight, fontSize, lineNumbers: showLineNumbers } = usePreferences()

  const [height, setHeight] = useState(EDITOR_HEIGHT_MAP[editorHeight])
  const isDragging = useRef(false)
  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)

  useEffect(() => {
    setHeight(EDITOR_HEIGHT_MAP[editorHeight])
  }, [editorHeight])

  const onDragMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    dragStartY.current = e.clientY
    dragStartHeight.current = height
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }, [height])

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return
      const delta = e.clientY - dragStartY.current
      setHeight(Math.max(100, dragStartHeight.current + delta))
    }
    function onMouseUp() {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    completedRef.current = false
    hintTierRef.current = 0
    resetUsedRef.current = false
    modeHistoryRef.current = []
    currentTargetIdxRef.current = 0
    segmentKeystrokesRef.current = 0
    totalActualRef.current = 0
    totalIdealRef.current = 0
    totalTimeRef.current = 0
    segmentStartRef.current = Date.now()
    startTimeRef.current = Date.now()
    modeRepsRef.current = 0
    totalKeystrokesRef.current = 0
    currentStepIdxRef.current = 0
    setHintTier(0)
    setStepIdx(0)
    setGradeLabel(null)

    const finishEditGoal = (idealKs: number, resultType: 'edit' | 'multi' | 'mode') => {
      if (completedRef.current) return
      completedRef.current = true
      const elapsed = Date.now() - startTimeRef.current
      const stars = computeStars(
        totalKeystrokesRef.current,
        idealKs,
        elapsed,
        hintTierRef.current,
        resetUsedRef.current,
      )
      setCompleted(true)
      setGradeLabel(`${totalKeystrokesRef.current} keys vs ideal ${idealKs}`)
      onComplete?.({ type: resultType, stars })
    }

    const targetDecoration = (() => {
      if (goal?.type !== 'cursor-reach' || !goal.targets.length) return []

      const targetHighlight = EditorView.baseTheme({
        '.cm-goal-target': {
          outline: '2px solid #f59e0b',
          borderRadius: '2px',
          backgroundColor: 'rgba(245, 158, 11, 0.25)',
        },
      })

      const targetField = StateField.define<DecorationSet>({
        create(state) {
          try {
            const first = goal.targets[0].target
            const line = state.doc.line(first[0] + 1)
            const pos = line.from + first[1]
            if (pos < state.doc.length) {
              return RangeSet.of([Decoration.mark({ class: 'cm-goal-target' }).range(pos, pos + 1)])
            }
          } catch {}
          return Decoration.none
        },
        update(deco, tr) {
          for (const e of tr.effects) {
            if (e.is(setTargetEffect)) {
              if (e.value < 0) return Decoration.none
              if (e.value < tr.newDoc.length) {
                return RangeSet.of([Decoration.mark({ class: 'cm-goal-target' }).range(e.value, e.value + 1)])
              }
              return Decoration.none
            }
          }
          return deco
        },
        provide: f => EditorView.decorations.from(f),
      })

      return [targetHighlight, targetField]
    })()

    const keystrokeTracker = EditorView.domEventHandlers({
      keydown: (event) => {
        if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return false

        if (goal?.type === 'cursor-reach') {
          if (BLOCKED_NAV_KEYS.has(event.key)) {
            event.preventDefault()
            return true
          }
          const idx = currentTargetIdxRef.current
          const allowed = goal.targets[idx]?.allowedKeys
          if (allowed && !allowed.includes(event.key)) {
            event.preventDefault()
            return true
          }
          if (!completedRef.current) segmentKeystrokesRef.current++
        }

        if (!completedRef.current) totalKeystrokesRef.current++
        return false
      },
    })

    const modeDisplay = EditorView.updateListener.of((update) => {
      const m = readVimMode(update.view)
      if (m) {
        const label = m === 'INSERT' ? 'EDIT' : m === 'VISUAL' || m === 'VISUAL_LINE' ? 'SELECT' : 'NAV'
        setModeLabel(label)

        if (goal?.type === 'mode-sequence' && !completedRef.current) {
          const hist = modeHistoryRef.current
          if (hist[hist.length - 1] !== m) hist.push(m)
          if (isSubsequence(goal.sequence, hist)) {
            const finalText = update.view.state.doc.toString()
            const contentOk = !goal.contentCheck || goal.contentCheck(finalText, initialText)
            modeHistoryRef.current = []
            if (contentOk) {
              modeRepsRef.current++
              setModeRepsDisplay(modeRepsRef.current)
              if (modeRepsRef.current >= goal.reps) {
                const idealKs = goal.idealKeystrokes ?? Math.max(1, goal.reps * goal.sequence.length)
                finishEditGoal(idealKs, 'mode')
              }
            }
          }
        }
      }

      if (goal?.type === 'cursor-reach' && !completedRef.current) {
        const idx = currentTargetIdxRef.current
        if (idx >= goal.targets.length) return

        const currentTarget = goal.targets[idx]
        const pos = update.view.state.selection.main.head
        const line = update.view.state.doc.lineAt(pos)
        const curLine = line.number - 1
        const curCol = pos - line.from

        if (curLine === currentTarget.target[0] && curCol === currentTarget.target[1]) {
          const segmentMs = Date.now() - segmentStartRef.current
          totalActualRef.current += segmentKeystrokesRef.current
          totalIdealRef.current += currentTarget.idealKeystrokes
          totalTimeRef.current += segmentMs

          const nextIdx = idx + 1

          if (nextIdx >= goal.targets.length) {
            completedRef.current = true
            const stars = computeStars(
              totalActualRef.current,
              totalIdealRef.current,
              totalTimeRef.current,
              hintTierRef.current,
              resetUsedRef.current,
            )
            setCompleted(true)
            setTargetsHit(nextIdx)
            setGradeLabel(`${totalActualRef.current} keys vs ideal ${totalIdealRef.current}`)
            onComplete?.({ type: 'navigation', stars })
          } else {
            currentTargetIdxRef.current = nextIdx
            segmentKeystrokesRef.current = 0
            segmentStartRef.current = Date.now()
            setTargetsHit(nextIdx)

            const nextTarget = goal.targets[nextIdx].target
            try {
              const nextLine = update.view.state.doc.line(nextTarget[0] + 1)
              const nextPos = nextLine.from + nextTarget[1]
              update.view.dispatch({ effects: [setTargetEffect.of(nextPos)] })
            } catch {}
          }
        }
      }

      if (goal?.type === 'text-equals' && !completedRef.current) {
        const text = update.view.state.doc.toString()
        if (text === goal.expected) {
          if (goal.requireNormalOnExit && readVimMode(update.view) !== 'NORMAL') return
          finishEditGoal(goal.idealKeystrokes, 'edit')
        }
      }

      if (goal?.type === 'text-matches' && !completedRef.current) {
        const text = update.view.state.doc.toString()
        if (goal.pattern.test(text)) {
          if (goal.requireNormalOnExit && readVimMode(update.view) !== 'NORMAL') return
          finishEditGoal(goal.idealKeystrokes, 'edit')
        }
      }

      if (goal?.type === 'multi-step' && !completedRef.current) {
        const idx = currentStepIdxRef.current
        const step = goal.steps[idx]
        if (!step) return
        const text = update.view.state.doc.toString()
        const mode = readVimMode(update.view)
        const pos = update.view.state.selection.main.head
        const line = update.view.state.doc.lineAt(pos)
        const curLine = line.number - 1
        const curCol = pos - line.from

        const textOk = step.textEquals != null
          ? text === step.textEquals
          : step.textMatches != null ? step.textMatches.test(text) : true
        const cursorOk = !step.cursor || (curLine === step.cursor[0] && curCol === step.cursor[1])
        const modeOk = !step.mode || step.mode === mode

        if (textOk && cursorOk && modeOk) {
          const nextIdx = idx + 1
          if (nextIdx >= goal.steps.length) {
            const idealKs = goal.steps.reduce((sum, s) => sum + (s.idealKeystrokes ?? 0), 0) || 1
            finishEditGoal(idealKs, 'multi')
          } else {
            currentStepIdxRef.current = nextIdx
            setStepIdx(nextIdx)
          }
        }
      }
    })

    const isDark = theme === 'dark'

    const lightTheme = EditorView.theme({
      '&': { fontSize: `${fontSize}px`, fontFamily: 'var(--font-mono), "JetBrains Mono", monospace', backgroundColor: '#ffffff' },
      '.cm-content': { padding: '16px 0' },
      '.cm-line': { padding: '0 16px', lineHeight: '1.7', color: '#1a1e2e' },
      '.cm-gutters': { backgroundColor: '#f0f2f8', borderRight: '1px solid #cdd4ea', color: '#a8b2d0' },
      '.cm-activeLineGutter': { backgroundColor: '#dde2f0' },
      '.cm-activeLine': { backgroundColor: '#dde2f0' },
      '.cm-cursor': { borderLeftColor: '#0d9b84', borderLeftWidth: '2px' },
      '.cm-focused': { outline: 'none' },
      '.cm-selectionBackground': { backgroundColor: '#cdd4ea !important' },
    })

    const darkTheme = EditorView.theme({
      '&': { fontSize: `${fontSize}px`, fontFamily: 'var(--font-mono), "JetBrains Mono", monospace', backgroundColor: '#1a1e2e' },
      '.cm-content': { padding: '16px 0' },
      '.cm-line': { padding: '0 16px', lineHeight: '1.7' },
      '.cm-gutters': { backgroundColor: '#161a28', borderRight: '1px solid #2e3450' },
      '.cm-activeLineGutter': { backgroundColor: '#1e2436' },
      '.cm-activeLine': { backgroundColor: '#1e2436' },
      '.cm-cursor': { borderLeftColor: '#4ec9b0', borderLeftWidth: '2px' },
      '.cm-focused': { outline: 'none' },
    })

    const blockMouse = EditorView.domEventHandlers({
      mousedown: (e, view) => { e.preventDefault(); view.focus(); return true },
      contextmenu: (e) => { e.preventDefault(); return true },
    })

    const state = EditorState.create({
      doc: initialText,
      extensions: [
        vim(),
        python(),
        history(),
        ...(showLineNumbers ? [lineNumbers()] : []),
        highlightActiveLine(),
        ...(isDark ? [oneDark, darkTheme] : [lightTheme]),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        modeDisplay,
        keystrokeTracker,
        blockMouse,
        ...targetDecoration,
      ],
    })

    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view
    view.focus()

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [initialText, theme, fontSize, showLineNumbers, goal, onComplete])

  function handleReset() {
    if (!viewRef.current) return
    viewRef.current.dispatch({
      changes: { from: 0, to: viewRef.current.state.doc.length, insert: initialText },
    })
    viewRef.current.focus()

    completedRef.current = false
    setCompleted(false)
    setGradeLabel(null)
    modeHistoryRef.current = []
    resetUsedRef.current = true
    totalKeystrokesRef.current = 0
    startTimeRef.current = Date.now()
    onReset?.()

    if (goal?.type === 'cursor-reach' && goal.targets.length > 0) {
      currentTargetIdxRef.current = 0
      segmentKeystrokesRef.current = 0
      totalActualRef.current = 0
      totalIdealRef.current = 0
      totalTimeRef.current = 0
      segmentStartRef.current = Date.now()
      setTargetsHit(0)
      try {
        const state = viewRef.current.state
        const first = goal.targets[0].target
        const line = state.doc.line(first[0] + 1)
        const pos = line.from + first[1]
        viewRef.current.dispatch({ effects: [setTargetEffect.of(pos)] })
      } catch {}
    }

    if (goal?.type === 'mode-sequence') {
      modeRepsRef.current = 0
      setModeRepsDisplay(0)
    }

    if (goal?.type === 'multi-step') {
      currentStepIdxRef.current = 0
      setStepIdx(0)
    }
  }

  function handleShowHint() {
    if (!hintTiers.length) return
    if (!showHint) {
      setShowHint(true)
      if (hintTier === 0) {
        hintTierRef.current = 1
        setHintTier(1)
        onHintUsed?.()
      }
      return
    }
    // already showing — advance tier if possible, else hide
    if (hintTier < hintTiers.length) {
      const next = hintTier + 1
      hintTierRef.current = next
      setHintTier(next)
    } else {
      setShowHint(false)
    }
  }

  function handleMarkComplete() {
    if (!completedRef.current) {
      completedRef.current = true
      setCompleted(true)
      onComplete?.({ type: 'manual' })
    }
  }

  const isManual = !goal || goal.type === 'manual'
  const totalTargets = goal?.type === 'cursor-reach' ? goal.targets.length : 0
  const totalReps = goal?.type === 'mode-sequence' ? goal.reps : 0
  const totalSteps = goal?.type === 'multi-step' ? goal.steps.length : 0
  const currentStepLabel = goal?.type === 'multi-step' ? goal.steps[stepIdx]?.label : null

  const hintButtonLabel = (() => {
    if (!hintTiers.length) return null
    if (!showHint) return hintTiers.length > 1 ? `hint (1/${hintTiers.length})` : 'hint'
    if (hintTier < hintTiers.length) return `hint (${hintTier}/${hintTiers.length}) — next`
    return 'hide hint'
  })()

  const visibleHint = showHint && hintTier > 0 ? hintTiers[Math.min(hintTier, hintTiers.length) - 1] : null

  return (
    <div>
      <div className="mb-3 p-5 bg-[var(--bg-surface)] rounded border border-[var(--border)]">
        <p className="font-mono text-sm text-[var(--text-secondary)] leading-[1.9]">
          <span className="text-[var(--accent)] font-semibold">Exercise: </span>
          {instructions}
        </p>
      </div>

      <div className="rounded-lg overflow-hidden border border-[var(--border)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border)]">
        <span className="size-2.5 rounded-full bg-[var(--tn-red)] opacity-70" />
        <span className="size-2.5 rounded-full bg-[var(--tn-orange)] opacity-70" />
        <span className="size-2.5 rounded-full bg-[var(--tn-green)] opacity-70" />
        <span className="flex-1 text-center font-mono text-xs text-[var(--text-secondary)]">Practice</span>
        <span className="w-[52px]" />
      </div>

      <div ref={containerRef} style={{ height: `${height}px`, overflow: 'auto' }} />

      <div
        onMouseDown={onDragMouseDown}
        className="h-2 bg-[var(--bg-base)] border-t border-[var(--border)] cursor-row-resize flex items-center justify-center group"
      >
        <div className="w-8 h-0.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors" />
      </div>

      <div className="bg-[var(--bg-base)] px-4 py-2 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
              modeLabel === 'EDIT'
                ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                : modeLabel === 'SELECT'
                ? 'bg-purple-500 text-white'
                : 'bg-[var(--bg-active)] text-[var(--text-secondary)]'
            }`}
          >
            {modeLabel}
          </span>
          {!completed && goal?.type === 'cursor-reach' && (
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              → {targetsHit} / {totalTargets}
            </span>
          )}
          {!completed && goal?.type === 'mode-sequence' && (
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              → {modeRepsDisplay} / {totalReps}
            </span>
          )}
          {!completed && goal?.type === 'multi-step' && (
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              → step {stepIdx + 1} / {totalSteps}
              {currentStepLabel ? ` — ${currentStepLabel}` : ''}
            </span>
          )}
          {completed && (
            <span className="font-mono text-xs text-yellow-400 font-semibold">
              ✓ complete{gradeLabel ? ` · ${gradeLabel}` : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hintButtonLabel && (
            <button
              onClick={handleShowHint}
              className="font-mono text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
            >
              {hintButtonLabel}
            </button>
          )}
          {isManual && !completed && (
            <button
              onClick={handleMarkComplete}
              className="font-mono text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-text)] transition-colors"
            >
              mark done
            </button>
          )}
          <button
            onClick={handleReset}
            className="font-mono text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
          >
            reset
          </button>
        </div>
      </div>

      {visibleHint && (
        <div className="bg-[var(--bg-surface)] border-t border-[var(--border)] px-4 py-2">
          <p className="font-mono text-xs text-[var(--text-secondary)]">
            <span className="text-yellow-500">Hint {hintTier}/{hintTiers.length}: </span>
            {visibleHint}
          </p>
        </div>
      )}
    </div>
    </div>
  )
}
