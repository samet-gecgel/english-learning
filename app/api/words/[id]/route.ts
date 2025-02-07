import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// Kelime güncelleme
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const word = await prisma.word.update({
      where: { id },
      data
    })

    return NextResponse.json(word)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update word' },
      { status: 500 }
    )
  }
}

// Kelime silme
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.word.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete word' },
      { status: 500 }
    )
  }

}