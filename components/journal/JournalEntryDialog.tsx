'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { JournalEntry } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface JournalEntryDialogProps {
  entry?: JournalEntry
  mode?: 'create' | 'edit'
  onClose?: () => void
}

export function JournalEntryDialog({ entry, mode = 'create', onClose }: JournalEntryDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [formData, setFormData] = useState(() => ({
    title: entry?.title ?? '',
    content: entry?.content ?? '',
    mood: entry?.mood ?? 'neutral',
    practiceTime: entry?.learningProgress?.practiceTime?.toString() ?? '',
    newWords: entry?.learningProgress?.newWords?.join(', ') ?? '',
    notes: entry?.learningProgress?.notes ?? '',
    tags: entry?.tags?.join(', ') ?? ''

  }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = mode === 'create' ? '/api/journal' : `/api/journal`
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: entry?.id,
          date: entry?.date || format(new Date(), 'yyyy-MM-dd')
        })
      })

      if (!response.ok) throw new Error('Failed to save entry')

      toast({
        title: mode === 'create' ? 'Entry Created' : 'Entry Updated',
        description: mode === 'create' 
          ? 'Your journal entry has been created successfully.'
          : 'Your journal entry has been updated successfully.',
      })

      router.refresh()
      setOpen(false)
      if (onClose) onClose()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!entry?.id) return
    setLoading(true)

    try {
      const response = await fetch(`/api/journal?id=${entry.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete entry')

      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted successfully.",
      })

      router.refresh()
      setOpen(false)
      setShowDeleteDialog(false)
      if (onClose) onClose()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete journal entry. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={mode === 'edit' ? 'outline' : 'default'}>
            {mode === 'create' ? 'New Entry' : 'Edit Entry'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create Journal Entry' : 'Edit Journal Entry'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            
            <Select
              value={formData.mood}
              onValueChange={value => setFormData(prev => ({ ...prev, mood: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="tired">Tired</SelectItem>
                <SelectItem value="motivated">Motivated</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Write about your learning experience today..."
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px]"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Practice time (minutes)"
                value={formData.practiceTime}
                onChange={e => setFormData(prev => ({ ...prev, practiceTime: e.target.value }))}
                required
              />
              <Input
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>

            <Textarea
              placeholder="New words learned (comma separated)"
              value={formData.newWords}
              onChange={e => setFormData(prev => ({ ...prev, newWords: e.target.value }))}
              className="min-h-[100px]"
            />

            <Textarea
              placeholder="Learning notes..."
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[100px]"
            />

            <div className="flex justify-end gap-2">
              {mode === 'edit' && (
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      Delete Entry
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your journal entry.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
} 