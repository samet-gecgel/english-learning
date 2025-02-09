'use client'

import { useState } from 'react'
import { Word } from '@prisma/client'
import { Flashcard } from '@/components/flashcards/Flashcard'
import { Button } from '@/components/ui/button'
import { useSpeech } from '@/hooks/useSpeech'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface FlashcardsProps {
  words: Word[]
}

export function Flashcards({ words }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const { speak: speakHook } = useSpeech()

  const currentWord = words[currentIndex]

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleSpeak = (text: string, isEnglish: boolean) => {
    speakHook(text, isEnglish ? 'en-US' : 'tr-TR')
  }

  if (!words.length) {
    return <div>No words available.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <p className="text-muted-foreground mt-2">
          Practice your vocabulary with flashcards. Click on a card to reveal its translation.
        </p>
      </div>

      <Flashcard
        word={currentWord}
        showTranslation={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
        onSpeak={handleSpeak}
      />

      <div className="flex items-center justify-between gap-4 px-4">
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {words.length}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 