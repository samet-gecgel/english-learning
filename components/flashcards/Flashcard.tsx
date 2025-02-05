'use client'

import { Word } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { SpeakerWaveIcon } from '@heroicons/react/24/outline'

interface FlashcardProps {
  word: Word
  showTranslation: boolean
  onFlip: () => void
}

export function Flashcard({ word, showTranslation, onFlip }: FlashcardProps) {
  const speak = (text: string, isEnglish: boolean = true) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = isEnglish ? 'en-US' : 'tr-TR'
      // Türkçe için daha doğal bir ses seçimi
      if (!isEnglish) {
        const voices = window.speechSynthesis.getVoices()
        const turkishVoice = voices.find(voice => voice.lang.includes('tr'))
        if (turkishVoice) utterance.voice = turkishVoice
      }
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Speech synthesis not supported:', error)
    }
  }

  return (
    <div
      onClick={onFlip}
      className="relative aspect-[3/2] w-full perspective-1000 mx-auto"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={showTranslation ? 'back' : 'front'}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border bg-card p-6 shadow-md"
        >
          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {word.level}
            </span>
          </div>

          {/* Sound Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              speak(showTranslation ? word.translation : word.word, !showTranslation)
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
            title={showTranslation ? "Türkçe telaffuzu dinle" : "Listen to English pronunciation"}
          >
            <SpeakerWaveIcon className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center space-y-3 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {showTranslation ? word.translation : word.word}
            </h2>
            
            {!showTranslation && (
              <p className="text-sm font-mono text-muted-foreground">
                /{word.pronunciation}/
              </p>
            )}

            {!showTranslation && word.sentences[0] && (
              <p className="text-sm text-muted-foreground italic mt-2">
                &quot;{word.sentences[0]}&quot;
              </p>
            )}

            {showTranslation && word.usageNotes && (
              <p className="text-sm text-muted-foreground italic">
                {word.usageNotes}
              </p>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              {showTranslation ? 'Tap to see word' : 'Tap to see translation'}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <div className="flex gap-1">
              <div className={`h-1 w-6 rounded-full transition-colors ${!showTranslation ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-1 w-6 rounded-full transition-colors ${showTranslation ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 