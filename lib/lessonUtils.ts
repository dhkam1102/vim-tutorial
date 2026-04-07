import { curriculum } from '@/data/curriculum'

export function getAdjacentLessons(sectionId: string, lessonId: string) {
  const allLessons: { sectionId: string; lessonId: string; title: string }[] = []

  for (const section of curriculum) {
    for (const lesson of section.lessons) {
      allLessons.push({ sectionId: section.id, lessonId: lesson.id, title: lesson.title })
    }
  }

  const idx = allLessons.findIndex(
    (l) => l.sectionId === sectionId && l.lessonId === lessonId
  )

  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  }
}

export function getFirstLesson() {
  const first = curriculum[0]?.lessons[0]
  if (!first) return null
  return { sectionId: curriculum[0].id, lessonId: first.id }
}
