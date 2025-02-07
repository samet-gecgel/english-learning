'use client'

import { Word } from "@/types"
import { useState } from "react"
import { ChevronDownIcon, PencilIcon, TrashIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline"
import { WordCardContent } from "./WordCardContent"
import { useRouter } from "next/navigation"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface IrregularForms {
  present: string
  past: string
  pastParticiple: string
}

export function WordCard({ word, onEdit }: { word: Word; onEdit?: (word: Word) => void }) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/words/${word.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete word')

      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting word:', error)
    }
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

  return (
    <>
      <Dialog>
        <div className="group rounded-xl border bg-card p-5 sm:p-6 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{word.word}</h3>
              <button
                onClick={() => speak(word.word, true)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                title="Listen to English pronunciation"
              >
                <SpeakerWaveIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(word)}
                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                title="Edit word"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                title="Delete word"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <p className="text-lg text-muted-foreground">{word.translation}</p>
            <button
              onClick={() => speak(word.translation, false)}
              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              title="Türkçe telaffuzu dinle"
            >
              <SpeakerWaveIcon className="h-4 w-4" />
            </button>
          </div>

          <WordCardContent word={word} />

          <DialogTrigger asChild>
            <button className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
              View Details
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{word.word}</span>
                <button
                  onClick={() => speak(word.word, true)}
                  className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Listen to English pronunciation"
                >
                  <SpeakerWaveIcon className="h-4 w-4" />
                </button>
                <span className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                  {word.translation}
                  <button
                    onClick={() => speak(word.translation, false)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    title="Türkçe telaffuzu dinle"
                  >
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  {word.level}
                </span>
                <span className="text-muted-foreground">
                  Added: {new Date(word.dateAdded).toLocaleString()}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Pronunciation & Usage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-2">Pronunciation</h4>
                <p className="text-sm font-mono text-muted-foreground">/{word.pronunciation}/</p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-2">Usage Notes</h4>
                <p className="text-sm text-muted-foreground">{word.usageNotes}</p>
              </div>
            </div>

            {/* Example Sentences */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-primary mb-2">Example Sentences</h4>
              <ul className="space-y-2">
                {word.sentences.map((sentence, index) => (
                  <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
                    {sentence}
                  </li>
                ))}
              </ul>
            </div>

            {/* Irregular Forms */}
            {word.irregularForms && (
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-3">Irregular Forms</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Present', value: ((word.irregularForms as unknown) as IrregularForms).present },
                    { label: 'Past', value: ((word.irregularForms as unknown) as IrregularForms).past },
                    { label: 'Past Participle', value: ((word.irregularForms as unknown) as IrregularForms).pastParticiple }
                  ].map((form, index) => (
                    <div key={index} className="bg-background rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block mb-1">{form.label}</span>
                      <p className="text-sm font-medium">{form.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms & Antonyms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-3">Synonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.length > 0 ? (
                    word.synonyms.map((synonym, index) => (
                      <span 
                        key={index}
                        className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200"
                      >
                        {synonym}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No synonyms available</span>
                  )}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-3">Antonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {word.antonyms.length > 0 ? (
                    word.antonyms.map((antonym, index) => (
                      <span 
                        key={index}
                        className="px-2.5 py-1 text-xs rounded-lg bg-red-50 text-red-700 font-medium border border-red-200"
                      >
                        {antonym}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No antonyms available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Silme onay dialogu */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Word</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{word.word}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 