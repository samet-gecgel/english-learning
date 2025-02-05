import { getAllWords } from "@/lib/words"
import { WordList } from "@/components/words/WordList"
import { Suspense } from "react"

export default async function WordsPage() {
  const words = await getAllWords()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Word List</h1>
        <p className="text-muted-foreground">
          Browse through our collection of English words. Use filters to find exactly what you&apos;re looking for.
        </p>
      </div>

      {/* Word List Component */}
      <Suspense fallback={<div>Loading...</div>}>
        <WordList initialWords={words} />
      </Suspense>
    </div>
  )
} 