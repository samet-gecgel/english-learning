import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TopicNotes } from '@/components/study-notes/TopicNotes'

export default async function TopicPage({ params }: { params: { id: string } }) {
  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: { notes: true }
  })

  if (!topic) notFound()

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <TopicNotes topic={topic} />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0 