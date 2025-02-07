import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TopicNotes } from '@/components/study-notes/TopicNotes'
import { Topic } from '@/types'

export default async function TopicPage({ params }: { params: { id: string } }) {
  const topic = await getTopic(params.id)

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <TopicNotes topic={topic} />
    </div>
  )
}

async function getTopic(id: string): Promise<Topic> {
  const dbTopic = await prisma.topic.findUnique({
    where: { id },
    include: { notes: true }
  })
  
  if (!dbTopic) notFound()
  
  return {
    id: dbTopic.id,
    title: dbTopic.title,
    description: dbTopic.description,
    category: dbTopic.category,
    dateCreated: dbTopic.dateCreated.toISOString(),
    lastUpdated: dbTopic.lastUpdated?.toISOString() || null,
    notes: dbTopic.notes.map(note => ({
      id: note.id,
      content: note.content,
      dateCreated: note.dateCreated.toISOString(),
      topicId: note.topicId
    }))
  }
} 