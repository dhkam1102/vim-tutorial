'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <div className="w-full max-w-sm p-8 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
        <h1 className="font-mono text-xl font-bold text-[var(--text-primary)] mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-xs text-[var(--text-secondary)] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full font-mono text-sm px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-[var(--text-secondary)] mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full font-mono text-sm px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-sm py-2 rounded bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="font-mono text-xs text-[var(--text-secondary)] mt-4 text-center">
          No account?{' '}
          <Link href="/auth/register" className="text-[var(--accent)] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
