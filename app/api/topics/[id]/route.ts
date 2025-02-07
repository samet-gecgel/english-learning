import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        ...data,
        lastUpdated: new Date()
      },
      include: {
        notes: true
      }
    })

    return NextResponse.json(topic)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    )
  }

}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.topic.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    )
  }
} 