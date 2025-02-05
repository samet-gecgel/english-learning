'use client'

import { useEffect, useState } from 'react'
import { Word } from '@/types'
import { Statistics } from '@/components/statistics/Statistics'

export default function StatisticsPage() {
  const [mounted, setMounted] = useState(false)
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    fetch('/api/words')
      .then(res => res.json())
      .then(data => setWords(data))
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Statistics</h1>
          <p className="text-muted-foreground mt-2">
            Track your learning progress and achievements.
          </p>
        </div>
        <Statistics words={words} />
      </div>
    </div>
  )
} 