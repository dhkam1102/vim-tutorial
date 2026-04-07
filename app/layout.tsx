import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'VimTutor – Interactive Vim Tutorial',
  description: 'Learn vim interactively — from basic movement to advanced text objects and visual mode.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`}>
      <body className="h-full flex bg-[#161a28] antialiased">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 bg-[#1a1e2e] border-r border-[#2e3450] h-full fixed left-0 top-0 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="ml-72 flex-1 min-h-full overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
