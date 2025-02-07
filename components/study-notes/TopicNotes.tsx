'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Note {
  id: string
  content: string
  dateCreated: string
}

interface Topic {
  id: string
  title: string
  description: string
  category: string
  notes: Note[]
  dateCreated: string
  lastUpdated: string | null
}

export function TopicNotes({ topic }: { topic: Topic }) {
  const [newNote, setNewNote] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedTopic, setEditedTopic] = useState(topic)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingNote, setEditingNote] = useState<{ id: string; content: string } | null>(null)
  const [showDeleteNoteDialog, setShowDeleteNoteDialog] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setLoading(true)

    try {
      const response = await fetch(`/api/topics/${topic.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      })

      if (!response.ok) throw new Error()
      
      const data = await response.json()
      
      toast({
        title: "Note Added",
        description: "Your note has been saved successfully.",
      })

      setNewNote('')
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save note. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTopic = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedTopic)
      })

      if (!response.ok) throw new Error()

      toast({
        title: "Topic Updated",
        description: "Topic has been updated successfully.",
      })

      setIsEditing(false)
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update topic. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTopic = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error()

      toast({
        title: "Topic Deleted",
        description: "Topic has been deleted successfully.",
      })

      router.push('/study-notes')
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete topic. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return
    setLoading(true)

    try {
      const response = await fetch(`/api/topics/${topic.id}/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingNote.content })
      })

      if (!response.ok) throw new Error()

      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully.",
      })

      setEditingNote(null)
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update note. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/topics/${topic.id}/notes/${noteId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error()

      toast({
        title: "Note Deleted",
        description: "Note has been deleted successfully.",
      })

      setShowDeleteNoteDialog(null)
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete note. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href="/study-notes"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Topics
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={editedTopic.title}
              onChange={e => setEditedTopic(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={editedTopic.description}
              onChange={e => setEditedTopic(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={editedTopic.category}
              onChange={e => setEditedTopic(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border p-2"
            >
              <option value="Grammar">Grammar</option>
              <option value="Vocabulary">Vocabulary</option>
              <option value="Pronunciation">Pronunciation</option>
              <option value="Writing">Writing</option>
              <option value="Speaking">Speaking</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Button onClick={handleUpdateTopic} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
              {topic.category}
            </span>
          </div>
          <p className="text-muted-foreground">{topic.description}</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Add New Note</h2>
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[150px]"
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.trim() || loading}
          >
            {loading ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <div className="space-y-4">
          {topic.notes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No notes yet. Start adding some!
            </p>
          ) : (
            topic.notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4 space-y-2"
              >
                {editingNote?.id === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote(prev => ({ ...prev!, content: e.target.value }))}
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={handleUpdateNote} 
                        disabled={loading || !editingNote.content.trim()}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingNote(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <p className="whitespace-pre-wrap flex-1">{note.content}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingNote({ id: note.id, content: note.content })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteNoteDialog(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(note.dateCreated), 'MMM d, yyyy HH:mm')}
                    </p>
                  </>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this topic and all its notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTopic}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog 
        open={showDeleteNoteDialog !== null} 
        onOpenChange={() => setShowDeleteNoteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteNoteDialog && handleDeleteNote(showDeleteNoteDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 