import { useSpeech } from '@/hooks/useSpeech'

interface WordCardProps {
  word: {
    word: string
    translation: string
  }
}

export function WordCard({ word }: WordCardProps) {
  const { speak } = useSpeech()

  const handleSpeak = (text: string, isEnglish: boolean) => {
    speak(text, isEnglish ? 'en-US' : 'tr-TR')
  }

  return (
    <div>
      <button onClick={() => handleSpeak(word.word, true)}>
        {word.word} 🔊
      </button>
      <button onClick={() => handleSpeak(word.translation, false)}>
        {word.translation} 🔊
      </button>
    </div>
  )
} 