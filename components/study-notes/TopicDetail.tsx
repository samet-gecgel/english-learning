'use client'

import { Topic, Note } from '@prisma/client'
import { useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import RichTextEditor from '@/components/RichTextEditor'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TopicDetailProps {
  topic: Topic & {
    notes: Note[]
  }
}

export default function TopicDetail({ topic }: TopicDetailProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editedContent, setEditedContent] = useState(topic.content || topic.description || '')
  const [editedTitle, setEditedTitle] = useState(topic.title || '')
  const [editedCategory, setEditedCategory] = useState(topic.category || '')
  const router = useRouter()

  const handleOpenDialog = () => {
    setEditedContent(topic.content || topic.description || '')
    setEditedTitle(topic.title || '')
    setEditedCategory(topic.category || '')
    setIsEditDialogOpen(true)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete topic')
      }

      setIsDeleteDialogOpen(false)
      router.push('/study-notes')
      router.refresh()
    } catch (error) {
      console.error('Failed to delete topic:', error)
      alert('Failed to delete topic. Please try again.')
    }
  }

  const handleUpdate = async () => {
    try {
      // Boş alan kontrolü
      if (!editedTitle.trim() || !editedCategory || !editedContent.trim()) {
        alert('Please fill in all fields')
        return
      }

      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle.trim(),
          description: editedContent.trim(),
          category: editedCategory,
          content: editedContent.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update topic')
      }

      setIsEditDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating topic:', error)
      alert('Failed to update topic. Please try again.')
    }
  }

  const handleEditDialogClose = (open: boolean) => {
    if (!open) {
      if (
        editedTitle !== topic.title ||
        editedContent !== (topic.content || topic.description) ||
        editedCategory !== topic.category
      ) {
        if (confirm('You have unsaved changes. Are you sure you want to close?')) {
          setIsEditDialogOpen(false)
        }
      } else {
        setIsEditDialogOpen(false)
      }
    } else {
      setIsEditDialogOpen(true)
    }
  }

  const handleDeleteDialogClose = (open: boolean) => {
    if (!open) {
      return
    }
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col space-y-4">
        <div>
          <Link 
            href="/study-notes" 
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
          >
            ← Back to Topics
          </Link>
          <h1 className="text-3xl font-bold mt-2">{topic.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
              {topic.category}
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: {topic.lastUpdated ? new Date(topic.lastUpdated).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenDialog}
          >
            <FaEdit className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <FaTrash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(topic.content || topic.description) 
          }} 
        />
      </div>

      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={handleEditDialogClose}
      >
        <DialogContent className="max-w-3xl" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={editedCategory} onValueChange={setEditedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grammar-Tenses">Grammar - Tenses</SelectItem>
                  <SelectItem value="Grammar-Articles">Grammar - Articles</SelectItem>
                  <SelectItem value="Grammar-Modals">Grammar - Modals</SelectItem>
                  <SelectItem value="Grammar-Conditionals">Grammar - Conditionals</SelectItem>
                  <SelectItem value="Grammar-Prepositions">Grammar - Prepositions</SelectItem>
                  <SelectItem value="Grammar-Other">Grammar - Other</SelectItem>
                  <SelectItem value="Vocabulary-Words">Vocabulary - Words</SelectItem>
                  <SelectItem value="Vocabulary-Phrases">Vocabulary - Phrases</SelectItem>
                  <SelectItem value="Vocabulary-Idioms">Vocabulary - Idioms</SelectItem>
                  <SelectItem value="Pronunciation">Pronunciation</SelectItem>
                  <SelectItem value="Speaking">Speaking</SelectItem>
                  <SelectItem value="Writing">Writing</SelectItem>
                  <SelectItem value="Reading">Reading</SelectItem>
                  <SelectItem value="Listening">Listening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                content={editedContent}
                onChange={setEditedContent}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={
                  !editedTitle.trim() || 
                  !editedCategory || 
                  !editedContent.trim() ||
                  (
                    editedTitle === topic.title &&
                    editedContent === (topic.content || topic.description) &&
                    editedCategory === topic.category
                  )
                }
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isDeleteDialogOpen} 
        onOpenChange={handleDeleteDialogClose}
      >
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Delete Topic</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{topic.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 