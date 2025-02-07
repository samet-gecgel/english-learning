import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const topicsPath = path.join(process.cwd(), 'data', 'topics.json')

export async function PUT(
  request: Request,
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const { id, noteId } = params
    const { content } = await request.json()
    
    const fileContents = await fs.readFile(topicsPath, 'utf8')
    const topics = JSON.parse(fileContents)
    
    const topicIndex = topics.topics.findIndex((t: any) => t.id === id)
    if (topicIndex === -1) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    const noteIndex = topics.topics[topicIndex].notes.findIndex((n: any) => n.id === noteId)
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    topics.topics[topicIndex].notes[noteIndex] = {
      ...topics.topics[topicIndex].notes[noteIndex],
      content,
    }

    topics.topics[topicIndex].lastUpdated = new Date().toISOString()

    await fs.writeFile(topicsPath, JSON.stringify(topics, null, 2))

    return NextResponse.json(topics.topics[topicIndex].notes[noteIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const { id, noteId } = params
    
    const fileContents = await fs.readFile(topicsPath, 'utf8')
    const topics = JSON.parse(fileContents)
    
    const topicIndex = topics.topics.findIndex((t: any) => t.id === id)
    if (topicIndex === -1) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    const noteIndex = topics.topics[topicIndex].notes.findIndex((n: any) => n.id === noteId)
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    topics.topics[topicIndex].notes.splice(noteIndex, 1)
    topics.topics[topicIndex].lastUpdated = new Date().toISOString()

    await fs.writeFile(topicsPath, JSON.stringify(topics, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
} 