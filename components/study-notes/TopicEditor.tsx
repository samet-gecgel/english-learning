'use client'

import { useState } from 'react'
import { Topic, Note } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface TopicWithNotes extends Topic {
  notes: Note[];
}

export function TopicEditor({ topic: initialTopic }: { topic: TopicWithNotes }) {
  const [topic, setTopic] = useState(initialTopic)
  const [content, setContent] = useState(topic.content)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (!response.ok) throw new Error('Failed to save content')

      setTopic(prev => ({
        ...prev,
        content,
        lastUpdated: new Date()
      }))

      toast({
        title: "Changes Saved",
        description: "Your content has been saved successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/study-notes" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
            {topic.category}
          </span>
          <span className="text-sm text-muted-foreground">
            Last updated: {topic.lastUpdated ? new Date(topic.lastUpdated).toLocaleDateString() : 'Never'}
          </span>
        </div>
        <p className="text-muted-foreground mb-6">{topic.description}</p>
      </div>

      <div className="space-y-4">
        <RichTextEditor 
          content={content} 
          onChange={setContent} 
        />
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="mt-4"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
} 