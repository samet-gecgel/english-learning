'use client'

import { useState, useEffect, useCallback } from 'react'
import { Word } from '@/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { SpeakerWaveIcon } from '@heroicons/react/24/outline'

interface QuizComponentProps {
  words: Word[]
}

type Question = {
  word: Word
  correctAnswer: string
}

export function QuizComponent({ words }: QuizComponentProps) {
  const [mounted, setMounted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const generateQuestions = useCallback(() => {
    const shuffledWords = [...words]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)
      .map(word => ({
        word,
        correctAnswer: word.translation
      }))

    setQuestions(shuffledWords)
  }, [words])

  useEffect(() => {
    if (words.length > 0) {
      generateQuestions()
      setMounted(true)
    }
  }, [words, generateQuestions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isCorrect !== null || !answer.trim() || showAnswer) return

    const correct = answer.toLowerCase().trim() === questions[currentIndex].correctAnswer.toLowerCase()
    setIsCorrect(correct)
    if (correct) setScore(score + 1)
  }

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setShowResult(true)
    } else {
      setCurrentIndex(currentIndex + 1)
      setAnswer('')
      setIsCorrect(null)
      setShowAnswer(false)
    }
  }

  const handleRestart = () => {
    generateQuestions()
    setCurrentIndex(0)
    setAnswer('')
    setIsCorrect(null)
    setScore(0)
    setShowResult(false)
    setShowAnswer(false)
  }

  const speak = (text: string, isEnglish: boolean = true) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = isEnglish ? 'en-US' : 'tr-TR'
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

  if (!mounted || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-full max-w-2xl rounded-xl border bg-muted animate-pulse h-[400px]" />
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-xl text-muted-foreground">
            Your score: {score} / {questions.length}
          </p>
        </div>
        <Button onClick={handleRestart} size="lg">
          Start New Quiz
        </Button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <Progress value={(currentIndex / questions.length) * 100} />
        </div>

        {/* Question Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Question */}
              <div className="text-center space-y-4">
                <div className="flex justify-end">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {currentQuestion.word.level}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-2xl font-bold">
                    {currentQuestion.word.word}
                  </h3>
                  <button
                    onClick={() => speak(currentQuestion.word.word, true)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    title="Listen to pronunciation"
                  >
                    <SpeakerWaveIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  /{currentQuestion.word.pronunciation}/
                </p>
              </div>

              {/* Answer Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type the Turkish translation..."
                    className="flex-1 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={isCorrect !== null || showAnswer}
                  />
                  {answer && (
                    <button
                      type="button"
                      onClick={() => speak(answer, false)}
                      className="p-4 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      title="Listen to your answer"
                    >
                      <SpeakerWaveIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  {isCorrect === null && !showAnswer && (
                    <Button type="submit" className="flex-1" size="lg" disabled={!answer.trim()}>
                      Check Answer
                    </Button>
                  )}
                  {isCorrect === null && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowAnswer(true)}
                      className="flex-shrink-0"
                      disabled={showAnswer}
                    >
                      Show Answer
                    </Button>
                  )}
                </div>
              </form>

              {/* Feedback or Show Answer */}
              {(isCorrect !== null || showAnswer) && (
                <div className={`p-4 rounded-lg ${
                  isCorrect 
                    ? 'bg-green-50 text-green-700' 
                    : isCorrect === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <span>
                      {isCorrect === null 
                        ? `The answer is: ${currentQuestion.correctAnswer}`
                        : isCorrect 
                        ? 'Correct!' 
                        : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
                    </span>
                    <button
                      onClick={() => speak(currentQuestion.correctAnswer, false)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      title="Listen to correct answer"
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Next Button */}
              {(isCorrect !== null || showAnswer) && (
                <Button 
                  onClick={handleNext} 
                  className="w-full"
                  size="lg"
                >
                  {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 