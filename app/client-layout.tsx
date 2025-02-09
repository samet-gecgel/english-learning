'use client'

import { useEffect } from "react"

function initSpeechSynthesis() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    // Sesleri önceden yükle
    window.speechSynthesis.getVoices()

    // Sesler yüklendiğinde event'i dinle
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    }
  }
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initSpeechSynthesis()
  }, [])

  return <>{children}</>
} 