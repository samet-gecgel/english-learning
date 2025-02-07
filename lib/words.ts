import { prisma } from './prisma'

export async function getAllWords() {
  try {
    const words = await prisma.word.findMany({
      orderBy: {
        dateAdded: 'desc'
      }
    })
    return words
  } catch (error) {
    console.error('Error loading words:', error)
    return []
  }
}

// Diğer fonksiyonları şimdilik kaldırıyoruz, ihtiyaç oldukça ekleyeceğiz 