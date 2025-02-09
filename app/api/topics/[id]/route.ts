import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: params.id },
      include: { notes: true }
    })

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    console.log('Updating topic with data:', body, 'for ID:', params.id)

    // Önce topic'in var olduğunu kontrol edelim
    const existingTopic = await prisma.topic.findUnique({
      where: { id: params.id },
    })

    if (!existingTopic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    const topic = await prisma.topic.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        content: body.content,
        lastUpdated: new Date(),
      },
    })

    revalidatePath(`/study-notes/${params.id}`)
    revalidatePath('/study-notes')

    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json(
      { error: 'Failed to update topic', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.topic.delete({
      where: {
        id: params.id,
      },
    })
    return NextResponse.json({ message: 'Topic deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    )
  }
} 