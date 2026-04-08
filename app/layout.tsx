import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import SidebarLayout from '@/components/SidebarLayout'
import { ThemeProvider } from '@/context/ThemeContext'
import { PreferencesProvider } from '@/context/PreferencesContext'
import AuthSessionProvider from '@/components/AuthSessionProvider'
import { ProgressProvider } from '@/context/ProgressContext'

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
    <html lang="en" className={`${geistMono.variable} h-full`} data-theme="dark">
      <body className="h-full flex bg-[var(--bg-base)] antialiased">
        <ThemeProvider>
          <PreferencesProvider>
            <AuthSessionProvider>
              <ProgressProvider>
                <SidebarLayout>{children}</SidebarLayout>
              </ProgressProvider>
            </AuthSessionProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
