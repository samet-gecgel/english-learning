import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      include: {
        notes: true
      },
      orderBy: {
        dateCreated: 'desc'
      }
    })
    return NextResponse.json(topics)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }

}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const topic = await prisma.topic.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        content: data.content,
        dateCreated: new Date(),
      }
    })

    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
} 