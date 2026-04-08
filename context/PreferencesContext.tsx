'use client'

import { createContext, useContext, useEffect, useState, startTransition } from 'react'

type EditorHeight = 'sm' | 'md' | 'lg'
type FontSize = 14 | 16 | 18

type Preferences = {
  editorHeight: EditorHeight
  fontSize: FontSize
  lineNumbers: boolean
}

type PreferencesContextType = Preferences & {
  setEditorHeight: (h: EditorHeight) => void
  setFontSize: (s: FontSize) => void
  setLineNumbers: (v: boolean) => void
}

const PreferencesContext = createContext<PreferencesContextType>({
  editorHeight: 'md',
  fontSize: 16,
  lineNumbers: true,
  setEditorHeight: () => {},
  setFontSize: () => {},
  setLineNumbers: () => {},
})

const EDITOR_HEIGHT_MAP: Record<EditorHeight, number> = { sm: 200, md: 320, lg: 480 }

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [editorHeight, setEditorHeightState] = useState<EditorHeight>('md')
  const [fontSize, setFontSizeState] = useState<FontSize>(16)
  const [lineNumbers, setLineNumbersState] = useState(true)

  useEffect(() => {
    const h = localStorage.getItem('editorHeight') as EditorHeight | null
    const f = Number(localStorage.getItem('fontSize')) as FontSize
    const l = localStorage.getItem('lineNumbers')

    startTransition(() => {
      if (h === 'sm' || h === 'md' || h === 'lg') setEditorHeightState(h)
      if (f === 14 || f === 16 || f === 18) setFontSizeState(f)
      if (l !== null) setLineNumbersState(l === 'true')
    })
  }, [])

  function setEditorHeight(h: EditorHeight) {
    setEditorHeightState(h)
    localStorage.setItem('editorHeight', h)
  }

  function setFontSize(s: FontSize) {
    setFontSizeState(s)
    localStorage.setItem('fontSize', String(s))
  }

  function setLineNumbers(v: boolean) {
    setLineNumbersState(v)
    localStorage.setItem('lineNumbers', String(v))
  }

  return (
    <PreferencesContext.Provider value={{ editorHeight, fontSize, lineNumbers, setEditorHeight, setFontSize, setLineNumbers }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
}

export { EDITOR_HEIGHT_MAP }
