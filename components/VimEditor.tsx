'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'
import { vim, getCM } from '@replit/codemirror-vim'
import { oneDark } from '@codemirror/theme-one-dark'
import { python } from '@codemirror/lang-python'
import { useTheme } from '@/context/ThemeContext'
import { usePreferences, EDITOR_HEIGHT_MAP } from '@/context/PreferencesContext'

type VimEditorProps = {
  initialText: string
  instructions: string
  hint?: string
  solution?: string
  onComplete?: () => void
  onHintUsed?: () => void
  onReset?: () => void
}

export default function VimEditor({
  initialText,
  instructions,
  hint,
  solution,
  onComplete,
  onHintUsed,
  onReset,
}: VimEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const completedRef = useRef(false)
  const hintUsedRef = useRef(false)
  const [showHint, setShowHint] = useState(false)
  const [mode, setMode] = useState('NAV')
  const [completed, setCompleted] = useState(false)
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

    const modeDisplay = EditorView.updateListener.of((update) => {
      const cm = getCM(update.view)
      if (cm) {
        const vimState = cm.state.vim
        if (vimState) {
          const m = vimState.insertMode ? 'EDIT' : vimState.visualMode ? 'SELECT' : 'NAV'
          setMode(m)
        }
      }

      if (solution && !completedRef.current) {
        const doc = update.view.state.doc.toString().trimEnd()
        if (doc === solution.trimEnd()) {
          completedRef.current = true
          setCompleted(true)
          onComplete?.()
        }
      }
    })

    const isDark = theme === 'dark'

    const lightTheme = EditorView.theme({
      '&': {
        fontSize: `${fontSize}px`,
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        backgroundColor: '#ffffff',
      },
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
      '&': {
        fontSize: `${fontSize}px`,
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        backgroundColor: '#1a1e2e',
      },
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
        blockMouse,
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view
    view.focus()

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [initialText, theme, fontSize, showLineNumbers, solution, onComplete])

  function handleReset() {
    if (!viewRef.current) return
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: initialText,
      },
    })
    viewRef.current.focus()
    onReset?.()
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
      onComplete?.()
    }
  }

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
          {completed && (
            <span className="font-mono text-xs text-yellow-400 font-semibold">✓ complete</span>
          )}
        </div>
        <div className="flex gap-3">
          {hint && (
            <button
              onClick={handleShowHint}
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {showHint ? 'hide hint' : 'show hint'}
            </button>
          )}
          {!solution && !completed && (
            <button
              onClick={handleMarkComplete}
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              mark done
            </button>
          )}
          <button
            onClick={handleReset}
            className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
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
