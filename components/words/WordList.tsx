'use client'

import { useState, useMemo } from "react"
import type { Word } from "@/types"
import { WordFilters } from "./WordFilters"
import { WordCard } from "./WordCard"
import { AddWordForm } from "./AddWordForm"
import { Dialog } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface WordListProps {
  initialWords: Word[]
}

export function WordList({ initialWords }: WordListProps) {
  const [search, setSearch] = useState('')
  const [activeLevel, setActiveLevel] = useState('All')
  const [activeSort, setActiveSort] = useState('alphabetical')
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const router = useRouter()

  const filteredWords = useMemo(() => {
    return initialWords
      .filter(word => {
        const matchesSearch = word.word.toLowerCase().includes(search.toLowerCase()) ||
                            word.translation.toLowerCase().includes(search.toLowerCase())
        const matchesLevel = activeLevel === 'All' || word.level === activeLevel
        return matchesSearch && matchesLevel
      })
      .sort((a, b) => {
        switch (activeSort) {
          case 'alphabetical':
            return a.word.localeCompare(b.word)
          case 'difficulty':
            return a.difficulty - b.difficulty
          case 'newest':
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          default:
            return 0
        }
      })
  }, [initialWords, search, activeLevel, activeSort])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <WordFilters 
          onSearchChange={setSearch}
          onLevelChange={setActiveLevel}
          onSortChange={setActiveSort}
          activeLevel={activeLevel}
          activeSort={activeSort}
        />
        <AddWordForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredWords.map((word) => (
          <WordCard 
            key={word.id} 
            word={word} 
            onEdit={setEditingWord}
          />
        ))}
      </div>

      {editingWord && (
        <Dialog open={!!editingWord} onOpenChange={() => setEditingWord(null)}>
          <AddWordForm 
            initialWord={editingWord} 
            onSuccess={() => {
              setEditingWord(null)
              router.refresh()
            }}
          />
        </Dialog>
      )}

      {filteredWords.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground">No words found matching your criteria.</p>
        </div>
      )}
    </div>
  )
} 