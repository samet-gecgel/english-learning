import { prisma } from '@/lib/prisma'
import { TopicsList } from '@/components/study-notes/TopicsList'
import { AddTopicDialog } from '@/components/study-notes/AddTopicDialog'

export default async function StudyNotesPage() {
  const topics = await prisma.topic.findMany({
    include: {
      notes: true
    },
    orderBy: {
      dateCreated: 'desc'
    }
  })

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Study Notes</h1>
            <p className="text-muted-foreground mt-2">
              Keep track of your English learning topics and notes
            </p>
          </div>
          <AddTopicDialog />
        </div>
        <TopicsList topics={topics} />
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0 