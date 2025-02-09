'use client'

import { Word } from '@/types'
import { useState, useEffect } from 'react'
import { Flashcard } from './Flashcard'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon, ShuffleIcon } from 'lucide-react'
import { useSpeech } from '@/hooks/useSpeech'

interface FlashcardListProps {
  words: Word[]
}

export function FlashcardList({ words }: FlashcardListProps) {
  const { speak: speakHook } = useSpeech()
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])
  const [showTranslation, setShowTranslation] = useState(false)

  useEffect(() => {
    const initialWords = [...words].sort(() => Math.random() - 0.5)
    setShuffledWords(initialWords)
    setMounted(true)
  }, [words])

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowTranslation(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setShowTranslation(false)
    }
  }

  const handleShuffle = () => {
    const shuffled = [...shuffledWords].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
    setCurrentIndex(0)
    setShowTranslation(false)
  }

  const handleSpeak = (text: string, isEnglish: boolean) => {
    speakHook(text, isEnglish ? 'en-US' : 'tr-TR')
  }

  if (!mounted || shuffledWords.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-full sm:w-[480px] aspect-[3/2] rounded-2xl border bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full sm:w-[480px]">
        <Flashcard 
          word={shuffledWords[currentIndex]}
          showTranslation={showTranslation}
          onFlip={() => setShowTranslation(!showTranslation)}
          onSpeak={handleSpeak}
        />
      </div>

      {/* Navigation Controls */}
      <div className="w-full sm:w-[480px] flex flex-col gap-4">
        {/* Progress and Shuffle */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} / {shuffledWords.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShuffle}
            title="Shuffle cards"
            className="hover:bg-primary/10 hover:text-primary"
          >
            <ShuffleIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-full"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === shuffledWords.length - 1}
            className="w-full"
          >
            Next
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
} 