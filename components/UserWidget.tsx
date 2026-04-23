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
          className="block font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        >
          Sign in to save progress →
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 border-t border-[var(--border)]">
      <p
        className="font-mono text-xs text-[var(--text-secondary)] truncate mb-1"
        title={session.user.email ?? undefined}
      >
        {session.user.email}
      </p>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="font-mono text-xs text-[var(--text-secondary)] hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
      >
        Sign out
      </button>
    </div>
  )
}
