'use client'

import { useState, useEffect } from 'react'
import { Word } from '@/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'

interface DailyPracticeProps {
  words: Word[]
}

interface DailyProgress {
  date: string;
  wordsLearned: string[];
  goal: number;
  dailyWordIds: string[];
}

export function DailyPractice({ words }: DailyPracticeProps) {
  const [mounted, setMounted] = useState(false)
  const [dailyWords, setDailyWords] = useState<Word[]>([])
  const [progress, setProgress] = useState<DailyProgress>({
    date: '',
    wordsLearned: [],
    goal: 5,
    dailyWordIds: []
  })

  // Sadece client-side'da çalışacak
  useEffect(() => {
    setMounted(true)

    // Kaydedilmiş ilerlemeyi yükle
    const savedProgress = localStorage.getItem('dailyProgress')
    const today = format(new Date(), 'yyyy-MM-dd')

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      if (parsed.date === today) {
        setProgress(parsed)
        const savedWords = words.filter(word => parsed.dailyWordIds.includes(word.id))
        setDailyWords(savedWords)
        return
      }
    }

    // Yeni gün için kelime seç
    const selectedWords = [...words]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)

    const newProgress = {
      date: today,
      wordsLearned: [],
      goal: 5,
      dailyWordIds: selectedWords.map(w => w.id)
    }

    setDailyWords(selectedWords)
    setProgress(newProgress)
    localStorage.setItem('dailyProgress', JSON.stringify(newProgress))
  }, [words])

  const markWordAsLearned = async (wordId: string) => {
    try {
      // Kelimeyi güncelle
      await fetch(`/api/words/${wordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastReviewed: new Date().toISOString()
        })
      })

      // Local state'i güncelle
      const newProgress = {
        ...progress,
        wordsLearned: [...progress.wordsLearned, wordId]
      }
      setProgress(newProgress)
      localStorage.setItem('dailyProgress', JSON.stringify(newProgress))
    } catch (error) {
      console.error('Failed to mark word as learned:', error)
    }
  }

  // Server-side rendering için loading state
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-full max-w-2xl rounded-xl border bg-muted animate-pulse h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress Section */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Words Learned Today</span>
            <span>{progress.wordsLearned.length} / {progress.goal}</span>
          </div>
          <Progress value={(progress.wordsLearned.length / progress.goal) * 100} />
        </div>
      </div>

      {/* Daily Words */}
      <div className="grid gap-4">
        {dailyWords.map(word => (
          <div
            key={word.id}
            className="rounded-lg border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{word.word}</h3>
                <p className="text-muted-foreground">{word.translation}</p>
                {word.pronunciation && (
                  <p className="text-sm text-muted-foreground mt-1">
                    /{word.pronunciation}/
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => markWordAsLearned(word.id)}
                disabled={progress.wordsLearned.includes(word.id)}
              >
                {progress.wordsLearned.includes(word.id) ? 'Learned' : 'Mark as Learned'}
              </Button>
            </div>
            {word.usageNotes && (
              <p className="mt-2 text-sm">{word.usageNotes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 