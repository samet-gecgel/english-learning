import { promises as fs } from 'fs'
import path from 'path'
import { Word, WordsData } from '@/types'

export async function getAllWords(): Promise<Word[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'words.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data: WordsData = JSON.parse(fileContents)
    return data.words
  } catch (error) {
    console.error('Error loading words:', error)
    return []
  }
}

// Diğer fonksiyonları şimdilik kaldırıyoruz, ihtiyaç oldukça ekleyeceğiz 