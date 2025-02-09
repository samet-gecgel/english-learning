import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'  // Cache'i devre dışı bırak

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: {
        dateAdded: 'desc'
      }
    })

    console.log('Fetched words:', words) // Gelen verileri kontrol edelim

    if (!words || !words.length) {
      return NextResponse.json(
        { error: 'No words found' },
        { status: 404 }
      )
    }

    return NextResponse.json(words)
  } catch (error) {
    console.error('Error fetching words:', error)
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