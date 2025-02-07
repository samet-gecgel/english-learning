import { prisma } from '@/lib/prisma'
import { JournalClientWrapper } from '@/components/journal/JournalClientWrapper'
import { JournalEntry, LearningProgress } from '@/types'

export default async function JournalPage() {
  const dbEntries = await prisma.journalEntry.findMany({
    orderBy: { date: 'desc' }
  })

  const entries: JournalEntry[] = dbEntries.map(entry => ({
    ...entry,
    learningProgress: (entry.learningProgress as unknown) as LearningProgress
  }))

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <JournalClientWrapper entries={entries} />
    </div>
  )
} 