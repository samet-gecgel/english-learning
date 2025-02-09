import { prisma } from '@/lib/prisma'
import { Flashcards } from '@/components/flashcards/Flashcards'

export default async function FlashcardsPage() {
  const words = await prisma.word.findMany({
    orderBy: {
      dateAdded: 'desc'
    }
  })

  return (
    <div className="container py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
        <Flashcards words={words} />
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0 