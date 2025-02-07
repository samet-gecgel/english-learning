import { prisma } from '@/lib/prisma'
import { DailyPractice } from '@/components/daily/DailyPractice'
import { Word } from '@/types'

export default async function DailyPage() {
  const words = await prisma.word.findMany({
    orderBy: {
      dateAdded: 'desc'
    },
    take: 10, // Günlük pratik için 10 kelime
    select: {
      id: true,
      word: true,
      translation: true,
      level: true,
      pronunciation: true,
      usageNotes: true,
      sentences: true,
      irregularForms: true,
      synonyms: true,
      antonyms: true,
      wordFamily: true,
      examples: true,
      dateAdded: true,
      lastReviewed: true,
      difficulty: true
    }
  }) as Word[]

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Daily Practice</h1>
          <p className="text-muted-foreground mt-2">
            Practice your vocabulary with daily exercises
          </p>
        </div>
        <DailyPractice words={words} />
      </div>
    </div>
  )
} 