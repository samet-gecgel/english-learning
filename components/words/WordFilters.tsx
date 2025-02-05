'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface WordFiltersProps {
  onSearchChange: (value: string) => void
  onLevelChange: (level: string) => void
  onSortChange: (sort: string) => void
  activeLevel: string
  activeSort: string
}

export function WordFilters({ 
  onSearchChange, 
  onLevelChange, 
  onSortChange,
  activeLevel,
  activeSort
}: WordFiltersProps) {
  const [mounted, setMounted] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearchChange(value)
  }

  if (!mounted) {
    return <div className="h-[100px]" />
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search words..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border pl-10 pr-4 py-2.5 bg-background"
        />
      </div>

      {/* Level Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onLevelChange(level)}
            className={`rounded-lg px-3.5 py-2 text-sm border whitespace-nowrap transition-colors
              ${activeLevel === level 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent/50'}`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select 
        className="rounded-lg border px-3 py-2 bg-background"
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="alphabetical">A-Z</option>
        <option value="difficulty">Difficulty</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  )
} 