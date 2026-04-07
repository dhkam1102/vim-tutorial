'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { curriculum } from '@/data/curriculum'
import KeyBadge from './KeyBadge'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="h-full overflow-y-auto py-6 px-2">
      <div className="mb-6 px-2">
        <Link href="/" className="font-mono text-xl font-bold text-white tracking-tight hover:text-[#4ec9b0] transition-colors">
          VimTutor
        </Link>
      </div>

      <div className="space-y-6">
        {curriculum.map((section) => (
          <div key={section.id}>
            <p className="px-2 mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#4ec9b0]">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.lessons.map((lesson) => {
                const href = `/lessons/${section.id}/${lesson.id}`
                const isActive = pathname === href
                return (
                  <li key={lesson.id}>
                    <Link
                      href={href}
                      className={`flex items-center justify-between gap-2 rounded-md px-2 py-2 font-mono text-sm transition-colors ${
                        isActive
                          ? 'bg-[#2e3450] border-l-2 border-[#4ec9b0] text-white pl-[6px]'
                          : 'text-[#9aa0c0] hover:bg-[#252a3a] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{lesson.title}</span>
                      <span className="flex gap-1 shrink-0">
                        {lesson.keys.slice(0, 3).map((k, i) => (
                          <KeyBadge key={i} keyName={k} />
                        ))}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
