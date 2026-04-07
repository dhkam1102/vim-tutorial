'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'
import { vim } from '@replit/codemirror-vim'
import { oneDark } from '@codemirror/theme-one-dark'

type VimEditorProps = {
  initialText: string
  instructions: string
  hint?: string
}

export default function VimEditor({ initialText, instructions, hint }: VimEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [mode, setMode] = useState('NORMAL')

  useEffect(() => {
    if (!containerRef.current) return

    const modeDisplay = EditorView.updateListener.of((update) => {
      const vimState = (update.state as any).field?.vim
      if (vimState) {
        const m = vimState.insertMode ? 'INSERT' : vimState.visualMode ? 'VISUAL' : 'NORMAL'
        setMode(m)
      }
    })

    const state = EditorState.create({
      doc: initialText,
      extensions: [
        vim(),
        history(),
        lineNumbers(),
        highlightActiveLine(),
        oneDark,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.theme({
          '&': {
            fontSize: '16px',
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
        }),
        modeDisplay,
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
  }, [initialText])

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
  }

  return (
    <div className="rounded-lg overflow-hidden border border-[#2e3450]">
      {/* Instructions bar */}
      <div className="bg-[#1e2436] px-4 py-3 border-b border-[#2e3450]">
        <p className="font-mono text-base text-[#9aa0c0]">
          <span className="text-[#4ec9b0] font-semibold">Exercise: </span>
          {instructions}
        </p>
      </div>

      {/* Editor */}
      <div ref={containerRef} className="min-h-[200px]" />

      {/* Status bar */}
      <div className="bg-[#161a28] px-4 py-2 border-t border-[#2e3450] flex items-center justify-between">
        <span
          className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
            mode === 'INSERT'
              ? 'bg-[#4ec9b0] text-[#161a28]'
              : mode === 'VISUAL'
              ? 'bg-purple-500 text-white'
              : 'bg-[#2e3450] text-[#9aa0c0]'
          }`}
        >
          -- {mode} --
        </span>
        <div className="flex gap-3">
          {hint && (
            <button
              onClick={() => setShowHint((v) => !v)}
              className="font-mono text-xs text-[#9aa0c0] hover:text-white transition-colors"
            >
              {showHint ? 'hide hint' : 'show hint'}
            </button>
          )}
          <button
            onClick={handleReset}
            className="font-mono text-xs text-[#9aa0c0] hover:text-[#4ec9b0] transition-colors"
          >
            reset
          </button>
        </div>
      </div>

      {/* Hint */}
      {showHint && hint && (
        <div className="bg-[#1e2436] border-t border-[#2e3450] px-4 py-2">
          <p className="font-mono text-xs text-[#9aa0c0]">
            <span className="text-yellow-400">Hint: </span>
            {hint}
          </p>
        </div>
      )}
    </div>
  )
}
