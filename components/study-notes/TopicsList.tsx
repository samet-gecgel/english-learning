'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Topic {
  id: string
  title: string
  description: string
  category: string
  dateCreated: string
  lastUpdated: string | null
  notes: any[]
}

export function TopicsList({ topics }: { topics: Topic[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/study-notes/${topic.id}`}>
            <div className="group h-full rounded-xl border bg-card p-6 hover:shadow-md transition-all">
              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                    {topic.category}
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-6 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {topic.notes.length} notes
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(topic.dateCreated), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
} 