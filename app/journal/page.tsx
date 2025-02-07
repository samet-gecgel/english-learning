import { prisma } from '@/lib/prisma'
import { JournalClientWrapper } from '@/components/journal/JournalClientWrapper'

export default async function JournalPage() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: {
      date: 'desc'
    }
  })

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <JournalClientWrapper entries={entries} />
    </div>
  )
} 