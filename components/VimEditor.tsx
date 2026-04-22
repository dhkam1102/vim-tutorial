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
  | { type: 'mode' | 'manual' }

// Module-scope so handleReset can reference it outside useEffect
const setTargetEffect = StateEffect.define<number>()  // char offset; -1 = hide

function isSubsequence(seq: string[], hist: string[]): boolean {
  let si = 0
  for (let hi = 0; hi < hist.length && si < seq.length; hi++) {
    if (hist[hi] === seq[si]) si++
  }
  return si === seq.length
}

function computeNavStars(
  actualKeystrokes: number,
  idealKeystrokes: number,
  totalMs: number,
  hintUsed: boolean,
  resetUsed: boolean,
): 1 | 2 | 3 {
  if (actualKeystrokes === 0) return 1
  const keystrokeEff = Math.min(1, idealKeystrokes / actualKeystrokes)
  const idealMs = idealKeystrokes * 700
  const timeEff = Math.min(1, idealMs / Math.max(totalMs, 1))
  const score = keystrokeEff * 0.5 + timeEff * 0.5
  const rawStars: 1 | 2 | 3 = score >= 0.50 ? 3 : score >= 0.30 ? 2 : 1
  if (hintUsed || resetUsed) return Math.min(rawStars, 2) as 1 | 2
  return rawStars
}

type VimEditorProps = {
  initialText: string
  instructions: string
  hint?: string
  goal?: ExerciseGoal
  onComplete?: (result: ExerciseResult) => void
  onHintUsed?: () => void
  onReset?: () => void
}

export default function VimEditor({
  initialText,
  instructions,
  hint,
  goal,
  onComplete,
  onHintUsed,
  onReset,
}: VimEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const completedRef = useRef(false)
  const hintUsedRef = useRef(false)
  const resetUsedRef = useRef(false)
  const modeHistoryRef = useRef<string[]>([])

  // Navigation (cursor-reach) refs
  const currentTargetIdxRef = useRef(0)
  const segmentKeystrokesRef = useRef(0)
  const totalActualRef = useRef(0)
  const totalIdealRef = useRef(0)
  const segmentStartRef = useRef(Date.now())
  const totalTimeRef = useRef(0)

  // Mode reps ref
  const modeRepsRef = useRef(0)

  const [showHint, setShowHint] = useState(false)
  const [mode, setMode] = useState('NAV')
  const [completed, setCompleted] = useState(false)
  const [targetsHit, setTargetsHit] = useState(0)
  const [modeRepsDisplay, setModeRepsDisplay] = useState(0)

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

    // Reset all tracking state on remount
    completedRef.current = false
    hintUsedRef.current = false
    resetUsedRef.current = false
    modeHistoryRef.current = []
    currentTargetIdxRef.current = 0
    segmentKeystrokesRef.current = 0
    totalActualRef.current = 0
    totalIdealRef.current = 0
    totalTimeRef.current = 0
    segmentStartRef.current = Date.now()
    modeRepsRef.current = 0

    // Target highlight decoration for cursor-reach goals
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

    // Keystroke counter for navigation scoring
    const keystrokeTracker = EditorView.domEventHandlers({
      keydown: (event) => {
        if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) {
          if (goal?.type === 'cursor-reach' && !completedRef.current) {
            segmentKeystrokesRef.current++
          }
        }
        return false
      },
    })

    const modeDisplay = EditorView.updateListener.of((update) => {
      const cm = getCM(update.view)
      if (cm) {
        const vimState = cm.state.vim
        if (vimState) {
          const m = vimState.insertMode ? 'INSERT' : vimState.visualMode ? 'VISUAL' : 'NORMAL'
          const label = m === 'INSERT' ? 'EDIT' : m === 'VISUAL' ? 'SELECT' : 'NAV'
          setMode(label)

          if (goal?.type === 'mode-sequence' && !completedRef.current) {
            const hist = modeHistoryRef.current
            if (hist[hist.length - 1] !== m) hist.push(m)
            if (isSubsequence(goal.sequence, hist)) {
              modeRepsRef.current++
              setModeRepsDisplay(modeRepsRef.current)
              modeHistoryRef.current = []  // reset for next rep
              if (modeRepsRef.current >= goal.reps) {
                completedRef.current = true
                setCompleted(true)
                onComplete?.({ type: 'mode' })
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
            const stars = computeNavStars(
              totalActualRef.current,
              totalIdealRef.current,
              totalTimeRef.current,
              hintUsedRef.current,
              resetUsedRef.current,
            )
            setCompleted(true)
            setTargetsHit(nextIdx)
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
      mousedown: (e) => { e.preventDefault(); return true },
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
    modeHistoryRef.current = []
    resetUsedRef.current = true
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
  }

  function handleShowHint() {
    setShowHint((v) => !v)
    if (!hintUsedRef.current) {
      hintUsedRef.current = true
      onHintUsed?.()
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

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--border)]">
      {/* Instructions bar */}
      <div className="bg-[var(--bg-surface)] px-4 py-3 border-b border-[var(--border)]">
        <p className="font-mono text-base text-[var(--text-secondary)]">
          <span className="text-[var(--accent)] font-semibold">Exercise: </span>
          {instructions}
        </p>
      </div>

      {/* Editor */}
      <div ref={containerRef} style={{ height: `${height}px`, overflow: 'auto' }} />

      {/* Drag handle */}
      <div
        onMouseDown={onDragMouseDown}
        className="h-2 bg-[var(--bg-base)] border-t border-[var(--border)] cursor-row-resize flex items-center justify-center group"
      >
        <div className="w-8 h-0.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors" />
      </div>

      {/* Status bar */}
      <div className="bg-[var(--bg-base)] px-4 py-2 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
              mode === 'EDIT'
                ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                : mode === 'SELECT'
                ? 'bg-purple-500 text-white'
                : 'bg-[var(--bg-active)] text-[var(--text-secondary)]'
            }`}
          >
            {mode}
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
          {completed && (
            <span className="font-mono text-xs text-yellow-400 font-semibold">✓ complete</span>
          )}
        </div>
        <div className="flex gap-2">
          {hint && (
            <button
              onClick={handleShowHint}
              className="font-mono text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
            >
              {showHint ? 'hide hint' : 'hint'}
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

      {/* Hint */}
      {showHint && hint && (
        <div className="bg-[var(--bg-surface)] border-t border-[var(--border)] px-4 py-2">
          <p className="font-mono text-xs text-[var(--text-secondary)]">
            <span className="text-yellow-500">Hint: </span>
            {hint}
          </p>
        </div>
      )}
    </div>
  )
}
