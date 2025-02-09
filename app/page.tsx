import Link from "next/link"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { prisma } from '@/lib/prisma'
import { Statistics } from '@/components/statistics/Statistics'

interface Word {
  id: string
  word: string
  translation: string
  lastReviewed: Date | null
}

// Sayfayı dinamik yap
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  let words: Word[] = []
  
  try {
    words = await prisma.word.findMany({
      select: {
        id: true,
        word: true,
        translation: true,
        lastReviewed: true
      }
    })
  } catch (error) {
    console.error('Error fetching words:', error)
  }

  return (
    <div className="flex flex-col gap-16 pb-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold py-2 tracking-tight sm:text-6xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Master English in One Month
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Enhance your English skills with our comprehensive learning platform. Start your journey today with interactive lessons, quizzes, and flashcards.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/words"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/words"
            className="group relative rounded-xl border p-6 hover:bg-accent/50 transition-colors"
          >
            <h3 className="font-semibold flex items-center gap-2">
              Word List
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse and search through our comprehensive word collection
            </p>
          </Link>
          <Link
            href="/flashcards"
            className="group relative rounded-xl border p-6 hover:bg-accent/50 transition-colors"
          >
            <h3 className="font-semibold flex items-center gap-2">
              Flashcards
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice with interactive flashcards for better memorization
            </p>
          </Link>
          <Link
            href="/quiz"
            className="group relative rounded-xl border p-6 hover:bg-accent/50 transition-colors"
          >
            <h3 className="font-semibold flex items-center gap-2">
              Take a Quiz
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Test your knowledge with our adaptive quizzes
            </p>
          </Link>
        </div>
      </section>

      <Statistics words={words} />
    </div>
  )
}
