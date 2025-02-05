import { promises as fs } from 'fs'
import path from 'path'
import { WordsData } from '@/types'
import { FlashcardList } from '@/components/flashcards/FlashcardList'

async function getWords() {
  const filePath = path.join(process.cwd(), 'data', 'words.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const data: WordsData = JSON.parse(fileContents)
  return data.words
}

export default async function FlashcardsPage() {
  const words = await getWords()

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-2">
            Practice your vocabulary with flashcards. Click on a card to reveal its translation.
          </p>
        </div>
        <FlashcardList words={words} />
      </div>
    </div>
  )
} 