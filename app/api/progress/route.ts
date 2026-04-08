import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 })

  const rows = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
  })

  const map: Record<string, object> = {}
  for (const row of rows) {
    map[`${row.sectionId}::${row.lessonId}`] = {
      stars: row.stars,
      completedAt: row.completedAt.toISOString(),
      hintsUsed: row.hintsUsed,
      resetsUsed: row.resetsUsed,
    }
  }
  return NextResponse.json(map)
}

const bodySchema = z.object({
  sectionId: z.string(),
  lessonId: z.string(),
  stars: z.number().int().min(1).max(3),
  hintsUsed: z.boolean(),
  resetsUsed: z.boolean(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 })

  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const { sectionId, lessonId, stars, hintsUsed, resetsUsed } = parsed.data

  const existing = await prisma.userProgress.findUnique({
    where: { userId_sectionId_lessonId: { userId: session.user.id, sectionId, lessonId } },
  })

  if (!existing || stars > existing.stars) {
    await prisma.userProgress.upsert({
      where: { userId_sectionId_lessonId: { userId: session.user.id, sectionId, lessonId } },
      update: { stars, hintsUsed, resetsUsed, completedAt: new Date() },
      create: { userId: session.user.id, sectionId, lessonId, stars, hintsUsed, resetsUsed },
    })
  }

  return NextResponse.json({ ok: true })
}
