import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function PUT(
  request: Request,
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const { id, noteId } = params
    const { content } = await request.json()

    const note = await prisma.note.update({
      where: { id: noteId },
      data: { content }
    })

    await prisma.topic.update({
      where: { id },
      data: { lastUpdated: new Date() }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const { id, noteId } = params

    await prisma.note.delete({
      where: { id: noteId }
    })

    await prisma.topic.update({
      where: { id },
      data: { lastUpdated: new Date() }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
} 