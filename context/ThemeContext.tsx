'use client'

import { createContext, useContext, useEffect, useState, startTransition } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: 'dark',
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const resolved = stored === 'light' || stored === 'dark' ? stored : 'dark'
    document.documentElement.setAttribute('data-theme', resolved)
    startTransition(() => setThemeState(resolved))
  }, [])

  function setTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem('theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
