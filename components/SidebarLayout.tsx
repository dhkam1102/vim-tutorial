'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Sidebar from './Sidebar'

const DEFAULT_WIDTH = 260
const MIN_WIDTH = 200
const MAX_WIDTH = 380
const MOBILE_BREAKPOINT = 768

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(DEFAULT_WIDTH)

  useEffect(() => {
    function checkMobile() {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (mobile) setCollapsed(true)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const savedWidth = localStorage.getItem('sidebarWidth')
    const savedCollapsed = localStorage.getItem('sidebarCollapsed')
    if (savedWidth) setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Number(savedWidth))))
    if (savedCollapsed === 'true') setCollapsed(true)
  }, [isMobile])

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
    if (!isMobile) localStorage.setItem('sidebarCollapsed', String(next))
  }

  const sidebarWidth = collapsed ? 0 : width

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={toggleCollapse}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: isMobile ? 'min(320px, 85vw)' : sidebarWidth }}
        className={`sidebar-scanlines shrink-0 bg-[var(--bg-sidebar)] border-r border-[var(--border)] h-full fixed left-0 top-0 overflow-hidden flex flex-col transition-[width,transform] duration-200 ${
          isMobile
            ? collapsed
              ? '-translate-x-full z-40'
              : 'translate-x-0 z-40'
            : 'z-20'
        }`}
        aria-label="Sidebar"
        aria-hidden={collapsed}
      >
        {(!collapsed || isMobile) && (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden h-full">
              <Sidebar onCollapse={toggleCollapse} />
            </div>
            {/* Drag handle — desktop only */}
            {!isMobile && (
              <div
                onMouseDown={onMouseDown}
                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-[var(--accent)] opacity-0 hover:opacity-40 transition-opacity"
                aria-hidden="true"
              />
            )}
          </>
        )}
      </aside>

      {/* Collapsed toggle tab */}
      {collapsed && (
        <button
          onClick={toggleCollapse}
          style={{ left: 0 }}
          className="fixed top-4 z-50 bg-[var(--bg-sidebar)] border border-[var(--border)] border-l-0 rounded-r px-1.5 py-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Main content */}
      <main
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        className="flex-1 min-h-full overflow-y-auto transition-[margin] duration-200"
        id="main-content"
      >
        {children}
      </main>
    </>
  )
}
