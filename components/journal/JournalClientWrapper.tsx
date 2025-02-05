'use client'

import { useState, useEffect } from 'react'
import { JournalEntry } from '@/types'
import { JournalCalendar } from './JournalCalendar'
import { JournalEntryDialog } from './JournalEntryDialog'

interface JournalClientWrapperProps {
  entries: JournalEntry[]
}

export function JournalClientWrapper({ entries }: JournalClientWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-[600px] bg-muted rounded-lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Learning Journal</h1>
          <p className="text-muted-foreground mt-2">
            Track your English learning journey day by day
          </p>
        </div>
        <JournalEntryDialog />
      </div>
      <JournalCalendar entries={entries} />
    </div>
  )
} 