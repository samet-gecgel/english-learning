import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

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
        ...data,
        dateCreated: new Date(),
        lastUpdated: null
      }
    })

    return NextResponse.json(topic, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
} 