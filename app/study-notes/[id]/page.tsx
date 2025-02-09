import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TopicDetail from '@/components/study-notes/TopicDetail'

export default async function TopicPage({ params }: { params: { id: string } }) {
  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: { notes: true }
  })

  if (!topic) notFound()

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full lg:w-1/2 px-4 py-8">
        <TopicDetail topic={topic} />
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0 