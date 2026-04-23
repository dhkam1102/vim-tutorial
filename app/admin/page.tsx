import { prisma } from '@/lib/prisma'

const TOTAL_LESSONS = 56

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    include: {
      progress: {
        orderBy: { completedAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto py-12 px-10">
      <p className="section-label mb-2">Dashboard</p>
      <h1 className="font-mono text-2xl font-bold text-[var(--text-primary)] mb-8">Admin</h1>
      <div className="rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <th className="text-left px-4 py-3"><span className="section-label">Email</span></th>
              <th className="text-left px-4 py-3"><span className="section-label">Role</span></th>
              <th className="text-left px-4 py-3"><span className="section-label">Completed</span></th>
              <th className="text-left px-4 py-3"><span className="section-label">Total <span className="star-filled">★</span></span></th>
              <th className="text-left px-4 py-3"><span className="section-label">Last active</span></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const completed = user.progress.length
              const totalStars = user.progress.reduce((sum, p) => sum + p.stars, 0)
              const lastActive = user.progress[0]?.completedAt
              return (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 text-[var(--text-primary)]">{user.email}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{user.role}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {completed} / {TOTAL_LESSONS}
                  </td>
                  <td className="px-4 py-3 text-[var(--accent)]">{totalStars}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {lastActive ? lastActive.toLocaleDateString() : '—'}
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--text-secondary)]">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
