import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const LESSON_MIGRATION: Record<string, Record<string, string>> = {
  'insert-like-a-pro': { 'insert-at-line-ends': 'basic-vim', 'opening-new-lines': 'basic-vim', 'making-small-edits': 'basic-vim' },
  'essential-motions': { 'moving-by-words': 'core-editing', 'moving-to-line-ends': 'line-control' },
  'basic-operators': { 'delete-lines': 'line-control', 'delete-multiple-lines': 'line-control' },
  'advanced-vertical-movement': { 'relative-line-jumps': 'precise-movement', 'paragraph-jumps': 'advanced-navigation', 'window-scrolls': 'advanced-navigation' },
  'text-objects-brackets': { 'intro-to-text-objects': 'text-objects', 'delete-inside-brackets': 'text-objects', 'delete-around-brackets': 'text-objects', 'change-inside-brackets': 'text-objects', 'change-around-brackets': 'text-objects', 'brackets-review': 'text-objects' },
  'text-objects-quotes': { 'delete-inside-quotes': 'text-objects', 'delete-around-quotes': 'text-objects', 'change-inside-quotes': 'text-objects', 'change-around-quotes': 'text-objects' },
  'text-objects-words': { 'delete-inside-word': 'text-objects', 'delete-around-word': 'text-objects', 'change-inside-word': 'text-objects' },
  'text-objects-paragraphs': { 'delete-inside-paragraph': 'text-objects', 'delete-around-paragraph': 'text-objects', 'change-inside-paragraph': 'text-objects' },
}

const SECTION_RENAME: Record<string, string> = {
  'basic-operators': 'core-editing',
  'advanced-vertical-movement': 'line-control',
  'essential-motions': 'precise-movement',
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 })

  const rows = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
  })

  for (const row of rows) {
    const movedTo = LESSON_MIGRATION[row.sectionId]?.[row.lessonId]
    const renamedTo = SECTION_RENAME[row.sectionId]
    const newSection = movedTo ?? renamedTo
    if (newSection) {
      await prisma.userProgress.update({
        where: { id: row.id },
        data: { sectionId: newSection },
      }).catch(() => {})
      row.sectionId = newSection
    }
  }

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

const deleteSchema = z.object({
  sectionId: z.string(),
  lessonId: z.string(),
})

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 })

  const parsed = deleteSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const { sectionId, lessonId } = parsed.data
  await prisma.userProgress.deleteMany({
    where: { userId: session.user.id, sectionId, lessonId },
  })
  return NextResponse.json({ ok: true })
}
