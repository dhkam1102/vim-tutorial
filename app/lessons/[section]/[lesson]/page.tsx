import { notFound } from 'next/navigation'
import { findLesson } from '@/data/curriculum'
import { getAdjacentLessons } from '@/lib/lessonUtils'
import LessonContent from '@/components/LessonContent'

export default async function LessonPage(props: PageProps<'/lessons/[section]/[lesson]'>) {
  const { section: sectionId, lesson: lessonId } = await props.params

  const found = findLesson(sectionId, lessonId)
  if (!found) notFound()

  const { prev, next } = getAdjacentLessons(sectionId, lessonId)

  return (
    <LessonContent
      section={found.section}
      lesson={found.lesson}
      prev={prev}
      next={next}
    />
  )
}
