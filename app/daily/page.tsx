import { promises as fs } from 'fs'
import path from 'path'
import { WordsData } from '@/types'
import { DailyPractice } from '@/components/daily/DailyPractice'

async function getWords() {
  const filePath = path.join(process.cwd(), 'data', 'words.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const data: WordsData = JSON.parse(fileContents)
  return data.words
}

export default async function DailyPage() {
  const words = await getWords()

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Daily Practice</h1>
          <p className="text-muted-foreground mt-2">
            Practice new words every day to improve your vocabulary.
          </p>
        </div>
        <DailyPractice words={words} />
      </div>
    </div>
  )
} 