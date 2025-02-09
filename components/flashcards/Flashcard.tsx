'use client'

import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { SpeakerWaveIcon } from '@heroicons/react/24/outline'

interface Word {
  id: string
  word: string
  translation: string
  pronunciation?: string | null
  level: string
}

interface FlashcardProps {
  word: Word
  showTranslation: boolean
  onFlip: () => void
  onSpeak: (text: string, isEnglish: boolean) => void
}

export function Flashcard({ word, showTranslation, onFlip, onSpeak }: FlashcardProps) {
  if (!word || !word.word || !word.translation) {
    return <div>Invalid word data</div>
  }

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
    <div className="relative w-full max-w-lg mx-auto aspect-video">
      <AnimatePresence initial={false} mode="wait">
        {!showTranslation ? (
          <motion.div
            key="front"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 180 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div 
              onClick={onFlip}
              className="w-full h-full bg-card border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="absolute top-3 left-3 px-2 py-1 text-xs bg-muted rounded-md">
                A2
              </div>
              <div className="absolute top-3 right-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSpeak(word.word, true)
                  }}
                >
                  <SpeakerWaveIcon className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-3xl font-bold mb-2">{word.word}</h2>
              {word.pronunciation && (
                <div className="text-sm text-muted-foreground">
                  /{word.pronunciation}/
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-4">
                Tap to see translation
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div 
              onClick={onFlip}
              className="w-full h-full bg-card border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="absolute top-3 left-3 px-2 py-1 text-xs bg-muted rounded-md">
                A2
              </div>
              <div className="absolute top-3 right-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSpeak(word.translation, false)
                  }}
                >
                  <SpeakerWaveIcon className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-3xl font-bold">{word.translation}</h2>
              <div className="text-xs text-muted-foreground mt-4">
                Tap to see word
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 