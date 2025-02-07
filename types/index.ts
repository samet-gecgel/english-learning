import { Prisma } from '@prisma/client'

// Prisma'nın ürettiği tipleri genişletelim
export type Word = Prisma.WordGetPayload<{
  select: {
    id: true
    word: true
    translation: true
    level: true
    pronunciation: true
    usageNotes: true
    sentences: true
    irregularForms: true
    synonyms: true
    antonyms: true
    wordFamily: true
    examples: true
    dateAdded: true
    lastReviewed: true
    difficulty: true
  }
}>

export type Topic = Prisma.TopicGetPayload<{
  include: {
    notes: true
  }
}>

export type Note = Prisma.NoteGetPayload<{
  select: {
    id: true
    content: true
    dateCreated: true
    topicId: true
  }
}>

export type JournalEntry = Prisma.JournalEntryGetPayload<{
  select: {
    id: true
    date: true
    title: true
    content: true
    mood: true
    learningProgress: true
    tags: true
    createdAt: true
  }
}>

export interface WordFormData {
  word: string
  translation: string
  level: string
  pronunciation: string | undefined
  usageNotes: string | undefined
  sentences: string[]
  irregularForms: Prisma.JsonValue
  synonyms: string[]
  antonyms: string[]
  wordFamily: string[]
  examples: Prisma.JsonValue
}

export interface WordsData {
  words: Word[];
}

export interface JournalData {
  entries: JournalEntry[]
} 