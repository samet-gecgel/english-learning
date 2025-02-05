import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { JournalData, JournalEntry } from '@/types'

const journalPath = path.join(process.cwd(), 'data', 'journal.json')

async function getJournalData(): Promise<JournalData> {
  const fileContents = await fs.readFile(journalPath, 'utf8')
  return JSON.parse(fileContents)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const journalData = await getJournalData()
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: data.date,
      title: data.title,
      content: data.content,
      mood: data.mood,
      learningProgress: {
        newWords: data.newWords.split(',').map((w: string) => w.trim()),
        practiceTime: parseInt(data.practiceTime),
        notes: data.notes
      },
      tags: data.tags.split(',').map((t: string) => t.trim())
    }

    journalData.entries.push(newEntry)
    await fs.writeFile(journalPath, JSON.stringify(journalData, null, 2))

    return NextResponse.json(newEntry)
  } catch {
    return NextResponse.json({ error: 'Failed to add entry' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const journalData = await getJournalData()
    
    const index = journalData.entries.findIndex(e => e.id === data.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const updatedEntry: JournalEntry = {
      ...journalData.entries[index],
      title: data.title,
      content: data.content,
      mood: data.mood,
      learningProgress: {
        newWords: data.newWords.split(',').map((w: string) => w.trim()),
        practiceTime: parseInt(data.practiceTime),
        notes: data.notes
      },
      tags: data.tags.split(',').map((t: string) => t.trim())
    }

    journalData.entries[index] = updatedEntry
    await fs.writeFile(journalPath, JSON.stringify(journalData, null, 2))

    return NextResponse.json(updatedEntry)
  } catch {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const journalData = await getJournalData()
    journalData.entries = journalData.entries.filter(e => e.id !== id)
    
    await fs.writeFile(journalPath, JSON.stringify(journalData, null, 2))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
} 