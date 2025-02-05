'use client'

import { useEffect, useState } from 'react'
import type { Word } from '@/types'

export function WordOfTheDay({ words }: { words: Word[] }) {
  const [todaysWord, setTodaysWord] = useState<Word | null>(null)

  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    setTodaysWord(words[dayOfYear % words.length])
  }, [words])

  if (!todaysWord) return null

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-center mb-8">Word of the Day</h2>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          {/* ... kelime detayları ... */}
        </div>
      </div>
    </section>
  )
} 