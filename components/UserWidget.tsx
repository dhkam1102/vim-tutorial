'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserWidget() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="px-4 py-3 border-t border-[var(--border)]">
        <Link
          href="/auth/login"
          className="block font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          Sign in to save progress →
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 border-t border-[var(--border)]">
      <p className="font-mono text-xs text-[var(--text-secondary)] truncate mb-1">{session.user.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="font-mono text-xs text-[var(--text-secondary)] hover:text-red-400 transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
