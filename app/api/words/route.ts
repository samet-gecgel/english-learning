import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: {
        dateAdded: 'desc'
      }
    })
    return NextResponse.json(words)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    )
  }

}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Aynı kelime var mı kontrol et
    const existingWord = await prisma.word.findFirst({
      where: {
        word: {
          equals: data.word,
          mode: 'insensitive' // büyük/küçük harf duyarsız
        }
      }
    })

    if (existingWord) {
      return NextResponse.json(
        { error: 'Word already exists' },
        { status: 409 }
      )
    }

    const word = await prisma.word.create({
      data: {
        ...data,
        dateAdded: new Date(),
        lastReviewed: null,
        difficulty: 1
      }
    })

    return NextResponse.json(word, { status: 201 })
  } catch (error) {
    console.error('Error adding word:', error)
    return NextResponse.json(
      { error: 'Failed to add word' },
      { status: 500 }
    )
  }
}