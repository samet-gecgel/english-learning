import { useCallback } from 'react'

export function useSpeech() {
  const speak = useCallback((text: string, language: 'en-US' | 'tr-TR') => {
    try {
      // Speech synthesis API'sinin varlığını kontrol et
      if (!window.speechSynthesis) {
        console.error('Speech synthesis is not supported in this browser')
        return
      }

      // Mevcut konuşmayı durdur
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Dil ayarlarını yap
      utterance.lang = language
      utterance.rate = 0.9 // Biraz yavaşlat
      
      // Uygun sesi bul
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(language) && !voice.localService
      )

      if (preferredVoice) {
        utterance.voice = preferredVoice
      } else {
        console.warn(`No preferred voice found for ${language}, using default`)
      }

      // Hata yakalama
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Speech synthesis failed:', error)
    }
  }, [])

  return { speak }
} 