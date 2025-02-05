import { Suspense } from 'react'
import { promises as fs } from 'fs'
import path from 'path'
import { JournalClientWrapper } from '@/components/journal/JournalClientWrapper'

interface JournalData {
  entries: JournalEntry[]
}

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood: string
  learningProgress: {
    newWords: string[]
    practiceTime: number
    notes: string
  }
  tags: string[]
}

async function getJournalEntries() {
  const filePath = path.join(process.cwd(), 'data', 'journal.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const data: JournalData = JSON.parse(fileContents)
  return data.entries
}

export default async function JournalPage() {
  const entries = await getJournalEntries()

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <JournalClientWrapper entries={entries} />
      </Suspense>
    </div>
  )
} 