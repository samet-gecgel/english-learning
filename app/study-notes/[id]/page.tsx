import { promises as fs } from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { TopicNotes } from '@/components/study-notes/TopicNotes'

async function getTopic(id: string) {
  const filePath = path.join(process.cwd(), 'data', 'topics.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const topic = JSON.parse(fileContents).topics.find((t: any) => t.id === id)
  if (!topic) notFound()
  return topic
}

export default async function TopicPage({ params }: { params: { id: string } }) {
  const topic = await getTopic(params.id)

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <TopicNotes topic={topic} />
    </div>
  )
} 