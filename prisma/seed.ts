import { prisma } from '../lib/prisma'
import words from '../data/words.json'
import topics from '../data/topics.json'
import { Prisma } from '@prisma/client'

async function main() {
  // Words
  for (const word of words.words) {
    await prisma.word.create({
      data: {
        id: word.id,
        word: word.word,
        translation: word.translation,
        level: word.level,
        pronunciation: word.pronunciation || '',
        usageNotes: word.usageNotes || '',
        sentences: word.sentences,
        irregularForms: word.irregularForms ? 
          (word.irregularForms as any) : 
          Prisma.DbNull,
        synonyms: word.synonyms,
        antonyms: word.antonyms,
        wordFamily: word.wordFamily,
        examples: word.examples ? 
          (word.examples as any) : 
          Prisma.DbNull,
        dateAdded: new Date(word.dateAdded),
        lastReviewed: word.lastReviewed ? new Date(word.lastReviewed) : null,
        difficulty: word.difficulty
      }
    })
  }

  // Topics and Notes
  for (const topic of topics.topics) {
    await prisma.topic.create({
      data: {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        dateCreated: new Date(topic.dateCreated),
        lastUpdated: topic.lastUpdated ? new Date(topic.lastUpdated) : null,
        notes: {
          create: topic.notes.map(note => ({
            id: note.id,
            content: note.content,
            dateCreated: new Date(note.dateCreated)
          }))
        }
      }
    })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 