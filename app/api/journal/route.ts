import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { JournalData, JournalEntry } from '@/types'
import { prisma } from '@/lib/prisma'

const journalPath = path.join(process.cwd(), 'data', 'journal.json')

async function getJournalData(): Promise<JournalData> {
  const fileContents = await fs.readFile(journalPath, 'utf8')
  return JSON.parse(fileContents)
}

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(entries)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const entry = await prisma.journalEntry.create({
      data: {
        ...data,
        date: new Date(data.date),
        createdAt: new Date()
      }
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const entry = await prisma.journalEntry.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        learningProgress: data.learningProgress,
        tags: data.tags
      }
    })
    return NextResponse.json(entry)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.journalEntry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
} 