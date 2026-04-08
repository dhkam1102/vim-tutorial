'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Sidebar from './Sidebar'

const DEFAULT_WIDTH = 600
const MIN_WIDTH = 180
const MAX_WIDTH = 600
const COLLAPSED_WIDTH = 0

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(DEFAULT_WIDTH)

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth')
    const savedCollapsed = localStorage.getItem('sidebarCollapsed')
    if (savedWidth) setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Number(savedWidth))))
    if (savedCollapsed === 'true') setCollapsed(true)
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = width
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [width])

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return
      const delta = e.clientX - startX.current
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta))
      setWidth(next)
    }
    function onMouseUp() {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setWidth(prev => {
        localStorage.setItem('sidebarWidth', String(prev))
        return prev
      })
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  function toggleCollapse() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebarCollapsed', String(next))
  }

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : width

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{ width: sidebarWidth }}
        className="shrink-0 bg-[var(--bg-sidebar)] border-r border-[var(--border)] h-full fixed left-0 top-0 overflow-hidden flex flex-col transition-[width] duration-150"
      >
        {!collapsed && (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <Sidebar onCollapse={toggleCollapse} />
            </div>
            {/* Drag handle */}
            <div
              onMouseDown={onMouseDown}
              className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-[var(--accent)] opacity-0 hover:opacity-30 transition-opacity"
            />
          </>
        )}
      </aside>

      {/* Collapsed toggle tab */}
      {collapsed && (
        <button
          onClick={toggleCollapse}
          style={{ left: 0 }}
          className="fixed top-4 z-50 bg-[var(--bg-sidebar)] border border-[var(--border)] border-l-0 rounded-r-md px-1.5 py-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Main content */}
      <main
        style={{ marginLeft: sidebarWidth }}
        className="flex-1 min-h-full overflow-y-auto transition-[margin] duration-150"
      >
        {children}
      </main>
    </>
  )
}
