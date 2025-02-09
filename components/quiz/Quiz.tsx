'use client'

import { useState, useEffect } from 'react'
import { Word } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useSpeech } from '@/hooks/useSpeech'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

interface QuizProps {
  words: Word[]
}

export function Quiz({ words }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [showedAnswer, setShowedAnswer] = useState(false)
  const { speak } = useSpeech()

  useEffect(() => {
    setShuffledWords(shuffleArray(words))
  }, [words])

  const shuffleArray = (array: Word[]) => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  const handleCheckAnswer = () => {
    if (showedAnswer) {
      const nextQuestion = currentQuestion + 1
      if (nextQuestion < words.length) {
        setCurrentQuestion(nextQuestion)
        setUserAnswer('')
        setShowedAnswer(false)
      } else {
        setShowScore(true)
      }
      return
    }

    const isCorrect = userAnswer.toLowerCase().trim() === currentWord?.translation.toLowerCase().trim()
    if (isCorrect) setScore(score + 1)

    const nextQuestion = currentQuestion + 1
    if (nextQuestion < words.length) {
      setCurrentQuestion(nextQuestion)
      setUserAnswer('')
    } else {
      setShowScore(true)
    }
  }

  const handleShowAnswer = () => {
    setUserAnswer(currentWord.translation)
    setShowedAnswer(true)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setUserAnswer('')
    setShowedAnswer(false)
    setShuffledWords(shuffleArray(words))
  }

  const handleSpeak = (text: string, isEnglish: boolean) => {
    speak(text, isEnglish ? 'en-US' : 'tr-TR')
  }

  if (!words || !words.length) {
    return <div>No words available.</div>
  }

  if (showScore) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">
          You scored {score} out of {words.length}!
        </h2>
        <Button onClick={handleRestart}>Restart Quiz</Button>
      </div>
    )
  }

  const currentWord = shuffledWords[currentQuestion]
  
  if (!currentWord) {
    return <div>Loading...</div>
  }

  const progress = ((currentQuestion + 1) / words.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Quiz</h1>
        <p className="text-muted-foreground mt-2">
          Test your vocabulary knowledge with different types of questions.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span>Question {currentQuestion + 1} of {words.length}</span>
        <span>Score: {score}</span>
      </div>

      <Progress value={progress} className="mb-8" />

      <div className="bg-card border rounded-lg p-8 space-y-6">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">A2</div>
          <h2 className="text-3xl font-bold mb-2">{currentWord.word}</h2>
          <div className="text-sm text-muted-foreground">
            // {currentWord.pronunciation || ''}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSpeak(currentWord.word, true)}
            className="mt-2"
          >
            🔊
          </Button>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Type the Turkish translation..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !showedAnswer) {
                handleCheckAnswer()
              }
            }}
            className="w-full"
            disabled={showedAnswer}
          />

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleShowAnswer}
              disabled={showedAnswer}
            >
              Show Answer
            </Button>
            <Button onClick={handleCheckAnswer}>
              {showedAnswer ? 'Next' : 'Check Answer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
} 