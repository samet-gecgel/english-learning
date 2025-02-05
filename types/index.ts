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

export interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood: string
  learningProgress: {
    newWords: string[]
    practiceTime: number
    notes: string
  }
  tags: string[]
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
  }
  synonyms: string[]
  antonyms: string[]
  wordFamily: ('noun' | 'verb' | 'adjective' | 'adverb')[]
  examples: Record<string, string[]>
} 