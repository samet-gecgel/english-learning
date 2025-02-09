'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Topic } from '@prisma/client'
import DOMPurify from 'isomorphic-dompurify'

interface TopicWithNotes extends Topic {
  notes: {
    id: string;
    content: string;
    dateCreated: Date;
  }[];
}

// İçeriğin ilk paragrafını alan yardımcı fonksiyon
const getFirstParagraph = (content: string): string => {
  // HTML içeriğini geçici bir div'e ekleyip ilk paragrafı alalım
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = DOMPurify.sanitize(content)
  
  // İlk paragraf veya text içeriğini bulalım
  const firstP = tempDiv.querySelector('p')
  const firstText = firstP?.textContent || tempDiv.textContent || ''
  
  // İçeriği 150 karakterle sınırlayalım
  return firstText.length > 150 
    ? firstText.substring(0, 150) + '...'
    : firstText
}

export function TopicsList({ topics }: { topics: TopicWithNotes[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/study-notes/${topic.id}`}>
            <div className="group relative rounded-lg border p-6 hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {topic.title}
              </h2>
              <div 
                className="text-sm text-muted-foreground line-clamp-3 mb-4"
                dangerouslySetInnerHTML={{ 
                  __html: getFirstParagraph(topic.content || topic.description) 
                }}
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{topic.notes.length} notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(topic.dateCreated), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <span className="absolute top-4 right-4 text-xs font-medium rounded-full px-2 py-1 bg-primary/10 text-primary">
                {topic.category}
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
} 