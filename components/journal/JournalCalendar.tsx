'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { JournalEntry } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Clock, Book, Tag, Sparkles } from 'lucide-react'
import { JournalEntryDialog } from './JournalEntryDialog'

interface LearningProgress {
  practiceTime: number
  newWords: string[]
  notes: string
}

interface JournalCalendarProps {
  entries: JournalEntry[]
}

export function JournalCalendar({ entries }: JournalCalendarProps) {
  const [date, setDate] = useState<Date>()
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  useEffect(() => {
    setDate(new Date())
  }, [])

  const handleSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      const entry = entries.find(e => format(new Date(e.date), 'yyyy-MM-dd') === formattedDate)
      setSelectedEntry(entry || null)
    }
  }

  return (
    <div className="grid lg:grid-cols-[300px,1fr] gap-6">
      <div className="space-y-4">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="rounded-md"
            modifiers={{
              hasEntry: (date) => 
                entries.some(e => format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
            }}
            modifiersStyles={{
              hasEntry: { 
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))',
                fontWeight: 'bold'
              }
            }}
          />
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-primary/10" />
            <span>Has Journal Entry</span>
          </div>
        </Card>
      </div>

      <Card className="p-6 h-fit">
        {selectedEntry ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{selectedEntry.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedEntry.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {selectedEntry.mood}
                  </Badge>
                  <JournalEntryDialog 
                    entry={selectedEntry} 
                    mode="edit" 
                    onClose={() => {
                      setSelectedEntry(null)
                      setDate(undefined)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert">
              <p>{selectedEntry.content}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="h-4 w-4" />
                  <h4 className="font-medium">Practice Time</h4>
                </div>
                <p className="text-2xl font-bold">
                  {((selectedEntry.learningProgress as unknown) as LearningProgress)?.practiceTime} min
                </p>
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Book className="h-4 w-4" />
                  <h4 className="font-medium">New Words</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {((selectedEntry.learningProgress as unknown) as LearningProgress)?.newWords.map(word => (
                    <Badge key={word} variant="secondary">
                      {word}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <h4 className="font-medium">Learning Notes</h4>
              </div>
              <p className="text-muted-foreground">
                {((selectedEntry.learningProgress as unknown) as LearningProgress)?.notes}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Tag className="h-4 w-4" />
                <h4 className="font-medium">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">No Entry Selected</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select a date to view or create a journal entry
            </p>
          </div>
        )}
      </Card>
    </div>
  )
} 