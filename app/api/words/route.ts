import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { WordsData, Word } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } } // params'ı bu şekilde alın
) {
  try {
    // words.json dosyasını oku
    const filePath = path.join(process.cwd(), 'data', 'words.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data: WordsData = JSON.parse(fileContent)

    // Güncellenmiş kelimeyi al
    const updatedWord: Word = await request.json()

    // params.id'yi kullanarak kelimeyi bul
    const wordId = params.id // params.id doğrudan kullanılabilir
    const index = data.words.findIndex((word) => word.id === wordId)

    // Kelime bulunamazsa hata döndür
    if (index === -1) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      )
    }

    // Kelimeyi güncelle
    data.words[index] = { ...data.words[index], ...updatedWord }

    // Dosyayı güncelle
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json(data.words[index], { status: 200 })
  } catch (error) {
    console.error('Error updating word:', error)
    return NextResponse.json(
      { error: 'Failed to update word' },
      { status: 500 }
    )
  }
}

const wordsPath = path.join(process.cwd(), 'data', 'words.json')

export async function POST(request: Request) {
  try {
    const newWord = await request.json()
    const fileContent = await fs.readFile(wordsPath, 'utf-8')
    const data: WordsData = JSON.parse(fileContent)

    // Aynı kelime var mı kontrol et
    const existingWord = data.words.find(
      word => word.word.toLowerCase() === newWord.word.toLowerCase()
    )

    if (existingWord) {
      return NextResponse.json(
        { error: 'Word already exists' },
        { status: 409 }
      )
    }

    const wordToAdd = {
      ...newWord,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      difficulty: 1,
      irregularForms: newWord.irregularForms || null,
      examples: newWord.examples || {},
      wordFamily: newWord.wordFamily || [],
      sentences: newWord.sentences || [],
      synonyms: newWord.synonyms || [],
      antonyms: newWord.antonyms || []
    }

    data.words.push(wordToAdd)
    await fs.writeFile(wordsPath, JSON.stringify(data, null, 2))
    return NextResponse.json(wordToAdd, { status: 201 })
  } catch (error) {
    console.error('Error adding word:', error)
    return NextResponse.json(
      { error: 'Failed to add word' },
      { status: 500 }
    )
  }
}