'use client'

import { Word, WordFormData } from "@/types"
import { useState } from "react"


const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
type WordType = 'noun' | 'verb' | 'adjective' | 'adverb'
const WORD_TYPES = ['noun', 'verb', 'adjective', 'adverb'] as const

interface WordFormProps {
  initialWord?: Word
  onSubmit: (data: WordFormData) => Promise<void>
  submitLabel: string
}

interface IrregularForms {
  present: string
  past: string
  pastParticiple: string
}

export function WordForm({ initialWord, onSubmit, submitLabel }: WordFormProps) {
  const [formData, setFormData] = useState<Omit<WordFormData, 'irregularForms'> & {
    irregularForms: IrregularForms
  }>({
    word: initialWord?.word || '',
    translation: initialWord?.translation || '',
    level: initialWord?.level || 'A1',
    pronunciation: initialWord?.pronunciation || '',
    usageNotes: initialWord?.usageNotes || '',
    sentences: Array.from({ length: 3 }, (_, i) => initialWord?.sentences?.[i] || ''),
    irregularForms: initialWord?.irregularForms ? 
      (JSON.parse(JSON.stringify(initialWord.irregularForms)) as unknown as IrregularForms) : 
      { present: '', past: '', pastParticiple: '' },
    synonyms: Array.from({ length: 3 }, (_, i) => initialWord?.synonyms?.[i] || ''),
    antonyms: Array.from({ length: 3 }, (_, i) => initialWord?.antonyms?.[i] || ''),
    wordFamily: initialWord?.wordFamily?.map(String) || [],
    examples: initialWord?.examples || {} as Record<string, string[]>
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const cleanedData: WordFormData = {
      word: formData.get('word')?.toString() || '',
      translation: formData.get('translation')?.toString() || '',
      level: formData.get('level')?.toString() || '',
      pronunciation: formData.get('pronunciation')?.toString() || '',
      usageNotes: formData.get('usageNotes')?.toString() || '',
      sentences: formData.get('sentences')?.toString().split('\n').filter(Boolean) || [],
      synonyms: formData.get('synonyms')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
      antonyms: formData.get('antonyms')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
      wordFamily: (formData.get('wordFamily')?.toString().split(',').map(s => s.trim()) || []) as ("noun" | "verb" | "adjective" | "adverb")[],
      irregularForms: formData.get('irregularForms') ? JSON.parse(formData.get('irregularForms')?.toString() || '{}') : null,
      examples: formData.get('examples') ? JSON.parse(formData.get('examples')?.toString() || '{}') : null
    }

    await onSubmit(cleanedData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Word</label>
          <input
            type="text"
            required
            value={formData.word}
            onChange={e => setFormData(prev => ({ ...prev, word: e.target.value }))}
            className="w-full rounded-md border p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Translation</label>
          <input
            type="text"
            required
            value={formData.translation}
            onChange={e => setFormData(prev => ({ ...prev, translation: e.target.value }))}
            className="w-full rounded-md border p-2"
          />
        </div>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Level</label>
        <select
          value={formData.level}
          onChange={e => setFormData(prev => ({ ...prev, level: e.target.value as typeof LEVELS[number] }))}
          className="w-full rounded-md border p-2"
        >
          {LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {/* Pronunciation and Usage Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pronunciation</label>
          <input
            type="text"
            value={formData.pronunciation}
            onChange={e => setFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
            className="w-full rounded-md border p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Usage Notes</label>
          <input
            type="text"
            value={formData.usageNotes}
            onChange={e => setFormData(prev => ({ ...prev, usageNotes: e.target.value }))}
            className="w-full rounded-md border p-2"
          />
        </div>
      </div>

      {/* Irregular Forms */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Irregular Forms</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Present"
            value={formData.irregularForms?.present}
            onChange={e => setFormData(prev => ({
              ...prev,
              irregularForms: { ...prev.irregularForms, present: e.target.value }
            }))}

            className="w-full rounded-md border p-2"
          />
          <input
            type="text"
            placeholder="Past"
            value={formData.irregularForms?.past}
            onChange={e => setFormData(prev => ({
              ...prev,
              irregularForms: { ...prev.irregularForms, past: e.target.value }
            }))}

            className="w-full rounded-md border p-2"
          />
          <input
            type="text"
            placeholder="Past Participle"
            value={formData.irregularForms?.pastParticiple}
            onChange={e => setFormData(prev => ({
              ...prev,
              irregularForms: { ...prev.irregularForms, pastParticiple: e.target.value }
            }))}

            className="w-full rounded-md border p-2"
          />
        </div>
      </div>

      {/* Example Sentences */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Example Sentences</label>
        <div className="space-y-2">
          {formData.sentences.map((sentence, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Example sentence ${index + 1}`}
              value={sentence}
              onChange={e => setFormData(prev => ({
                ...prev,
                sentences: prev.sentences.map((s, i) => i === index ? e.target.value : s)
              }))}
              className="w-full rounded-md border p-2"
            />
          ))}
        </div>
      </div>

      {/* Word Types */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Word Types</label>
        <div className="flex flex-wrap gap-2">
          {WORD_TYPES.map(type => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.wordFamily.includes(type)}
                onChange={e => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      wordFamily: [...prev.wordFamily, type as WordType]
                    }))
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      wordFamily: prev.wordFamily.filter(t => t !== type)
                    }))
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Synonyms & Antonyms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Synonyms</label>
          <div className="space-y-2">
            {formData.synonyms.map((synonym, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Synonym ${index + 1}`}
                value={synonym}
                onChange={e => {
                  const newSynonyms = [...formData.synonyms]
                  newSynonyms[index] = e.target.value
                  setFormData(prev => ({ ...prev, synonyms: newSynonyms }))
                }}
                className="w-full rounded-md border p-2"
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Antonyms</label>
          <div className="space-y-2">
            {formData.antonyms.map((antonym, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Antonym ${index + 1}`}
                value={antonym}
                onChange={e => {
                  const newAntonyms = [...formData.antonyms]
                  newAntonyms[index] = e.target.value
                  setFormData(prev => ({ ...prev, antonyms: newAntonyms }))
                }}
                className="w-full rounded-md border p-2"
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        {submitLabel}
      </button>
    </form>
  )
} 