'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import RichTextEditor from '@/components/RichTextEditor'
import { useRouter } from 'next/navigation'

export function AddTopicDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleDialogClose = (open: boolean) => {
    // Dialog kapanmaya çalışıyorsa (open === false)
    if (!open) {
      // İçerik girilmişse onay iste
      if (title || category || content) {
        if (confirm('You have unsaved changes. Are you sure you want to close?')) {
          setIsOpen(false)
          resetForm()
        }
      } else {
        // İçerik boşsa direkt kapat
        setIsOpen(false)
        resetForm()
      }
    } else {
      setIsOpen(true)
    }
  }

  const resetForm = () => {
    setTitle('')
    setCategory('')
    setContent('')
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          description: content,
          content: content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create topic')
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error creating topic:', error)
      alert('Failed to create topic. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <Button onClick={() => setIsOpen(true)}>
        Add Topic
      </Button>
      <DialogContent 
        className="max-w-3xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
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
              content={content}
              onChange={setContent}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Topic
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 