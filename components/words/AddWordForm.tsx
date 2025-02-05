'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Word } from "@/types"
import { useRouter } from 'next/navigation'
import { WordForm } from "./WordForm"
import { useState } from "react"

interface AddWordFormProps {
  initialWord?: Word
  onSuccess?: () => void
}

interface WordFormData {
  word: string
  translation: string
  level: string
  pronunciation: string
  usageNotes: string
  sentences: string[]
  irregularForms: {
    present: string
    past: string
    pastParticiple: string
  }
  synonyms: string[]
  antonyms: string[]
  wordFamily: ('noun' | 'verb' | 'adjective' | 'adverb')[]
  examples: Record<string, string[]>
}

export function AddWordForm({ initialWord, onSuccess }: AddWordFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setError(null)
    }
  }

  const handleSubmit = async (formData: WordFormData) => {
    try {
      // Boş alanları temizle
      const cleanedData = {
        ...formData,
        sentences: formData.sentences.filter(Boolean),
        synonyms: formData.synonyms.filter(Boolean),
        antonyms: formData.antonyms.filter(Boolean),
        irregularForms: Object.values(formData.irregularForms).some(Boolean)
          ? formData.irregularForms
          : null,
        examples: Object.keys(formData.examples).length > 0 
          ? formData.examples 
          : {}
      }

      const response = await fetch(
        initialWord 
          ? `/api/words/${initialWord.id}`
          : '/api/words', 
        {
          method: initialWord ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        if (response.status === 409) {
          setError('This word already exists in the dictionary.')
          return
        }
        throw new Error(data.error || 'Failed to save word')
      }

      router.refresh()
      onSuccess?.()
      setIsOpen(false)
      setError(null)
    } catch (error) {
      console.error('Error saving word:', error)
      setError('An error occurred while saving the word.')
    }
  }

  if (initialWord) {
    return (
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Word</DialogTitle>
        </DialogHeader>
        <WordForm 
          initialWord={initialWord}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </DialogContent>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            <PlusIcon className="h-5 w-5" />
            Add New Word
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Word</DialogTitle>
            {error && (
              <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </DialogHeader>
          <WordForm 
            onSubmit={handleSubmit}
            submitLabel="Add Word"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}