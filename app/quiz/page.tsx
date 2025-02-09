import { prisma } from '@/lib/prisma'
import { Quiz } from '@/components/quiz/Quiz'

export default async function QuizPage() {
  const words = await prisma.word.findMany({
    orderBy: {
      dateAdded: 'desc'
    }
  })

  return (
    <div className="container py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quiz</h1>
        <Quiz words={words} />
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0 