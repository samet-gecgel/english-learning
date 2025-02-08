import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { content } = await request.json()

    // Önce topic'in var olduğunu kontrol et
    const topic = await prisma.topic.findUnique({
      where: { id }
    })

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    // Yeni notu oluştur
    const note = await prisma.note.create({
      data: {
        content,
        topicId: id,
        dateCreated: new Date()
      }
    })

    // Topic'in lastUpdated alanını güncelle
    await prisma.topic.update({
      where: { id },
      data: { lastUpdated: new Date() }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error adding note:', error)
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    )
  }
} 