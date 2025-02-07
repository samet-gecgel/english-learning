import { Word, Topic, Note, JournalEntry } from '@prisma/client'

export type { Word, Topic, Note, JournalEntry }

export interface Word {
  id: string;
  word: string;
  translation: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  pronunciation: string;
  usageNotes: string;
  sentences: string[];
  irregularForms: {
    present: string;
    past: string;
    pastParticiple: string;
  } | null;
  synonyms: string[];
  antonyms: string[];
  wordFamily: ('noun' | 'verb' | 'adjective' | 'adverb')[];
  examples: Record<string, string[]>;
  dateAdded: string;
  lastReviewed: string | null;
  difficulty: number;
}

export interface WordsData {
  words: Word[];
}

export interface JournalData {
  entries: JournalEntry[]
}

export interface WordFormData {
  word: string
  translation: string
  level: string
  pronunciation: string
  usageNotes: string
  sentences: string[]
  irregularForms: {
    present: string
    past: string
    pastParticiple: string
  } | null
  synonyms: string[]
  antonyms: string[]
  wordFamily: ('noun' | 'verb' | 'adjective' | 'adverb')[]
  examples: Record<string, string[]>
}

export interface Topic {
  id: string
  title: string
  description: string
  category: string
  notes: Note[]
  dateCreated: string
  lastUpdated: string | null
}

export interface Note {
  id: string
  content: string
  dateCreated: string
} 