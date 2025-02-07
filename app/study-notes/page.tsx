import { promises as fs } from 'fs'
import path from 'path'
import { TopicsList } from '@/components/study-notes/TopicsList'
import { AddTopicDialog } from '@/components/study-notes/AddTopicDialog'

async function getTopics() {
  const filePath = path.join(process.cwd(), 'data', 'topics.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents).topics
}

export default async function StudyNotesPage() {
  const topics = await getTopics()

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