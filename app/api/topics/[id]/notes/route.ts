import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { content } = await request.json()

    const note = await prisma.note.create({
      data: {
        content,
        topicId: id
      }
    })

    await prisma.topic.update({
      where: { id },
      data: { lastUpdated: new Date() }
    })

    return NextResponse.json(note, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
} 