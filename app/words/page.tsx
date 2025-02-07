import { prisma } from '@/lib/prisma'
import { WordList } from "@/components/words/WordList"
import { Suspense } from "react"

export default async function WordsPage() {
  const words = await prisma.word.findMany({
    orderBy: {
      dateAdded: 'desc'
    }
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Words</h1>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <WordList initialWords={words} />
      </Suspense>
    </div>
  )
} 