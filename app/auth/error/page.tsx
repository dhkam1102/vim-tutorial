import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <div className="w-full max-w-sm p-8 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-center">
        <h1 className="font-mono text-xl font-bold text-[var(--text-primary)] mb-3">Auth error</h1>
        <p className="font-mono text-sm text-[var(--text-secondary)] mb-6">
          Something went wrong. Please try again.
        </p>
        <Link
          href="/auth/login"
          className="font-mono text-sm text-[var(--accent)] hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
