import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { Word, WordsData } from '@/types'

const wordsPath = path.join(process.cwd(), 'data', 'words.json')

// Kelime güncelleme
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params'ı async olarak bekle
    const { id } = await params

    const fileContent = await fs.readFile(wordsPath, 'utf-8')
    const data: WordsData = JSON.parse(fileContent)
    const updatedWord = await request.json() as Partial<Word>

    const index = data.words.findIndex(word => word.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      )
    }

    const existingWord = data.words[index]
    const newUpdatedWord = {
      ...existingWord,
      ...updatedWord,
      id,
      lastReviewed: new Date().toISOString().split('T')[0]
    }

    data.words[index] = newUpdatedWord
    await fs.writeFile(wordsPath, JSON.stringify(data, null, 2))
    
    return NextResponse.json(newUpdatedWord, { status: 200 })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update word' },
      { status: 500 }
    )
  }
}

// Kelime silme
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params'ı async olarak bekle
    const { id } = await params

    const fileContent = await fs.readFile(wordsPath, 'utf-8')
    const data: WordsData = JSON.parse(fileContent)
    const index = data.words.findIndex(word => word.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      )
    }

    const [deletedWord] = data.words.splice(index, 1)
    await fs.writeFile(wordsPath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      deletedId: deletedWord.id,
      remainingCount: data.words.length
    }, { status: 200 })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete word' },
      { status: 500 }
    )
  }
}