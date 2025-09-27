import Dexie, { Table } from 'dexie'
import { Word, Lesson, TestSession, Settings } from '../types'
import { wordsData } from '../data/words'

export class CincoPalabrasDB extends Dexie {
  words!: Table<Word>
  lessons!: Table<Lesson>
  testSessions!: Table<TestSession>
  settings!: Table<Settings>

  constructor() {
    super('CincoPalabrasDB')
    this.version(1).stores({
      words: '++id, spanish, transcription, russian, difficulty, createdAt',
      lessons: '++id, date, wordIds, isCompleted, isViewed, createdAt',
      testSessions: '++id, lessonId, wordId, correctAnswer, userAnswer, isCorrect, timeSpent, createdAt',
      settings: '++id, notificationTime, notificationsEnabled, dailyGoal, theme, language, createdAt, updatedAt'
    })
  }
}

export const db = new CincoPalabrasDB()

// Initialize default settings if none exist
export async function initializeSettings(): Promise<void> {
  const existingSettings = await db.settings.count()
  if (existingSettings === 0) {
    await db.settings.add({
      id: 1,
      notificationTime: '09:00',
      notificationsEnabled: false,
      dailyGoal: 5,
      theme: 'auto',
      language: 'ru',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
}

// Seed words from embedded data
export async function seedWords(): Promise<void> {
  const wordCount = await db.words.count()
  console.log(`Current word count in database: ${wordCount}`)
  
  if (wordCount === 0) {
    try {
      console.log('Seeding words from embedded data...')
      
      const words: Omit<Word, 'id'>[] = wordsData.map((word: any) => ({
        spanish: word.spanish || '',
        transcription: word.transcription || '',
        russian: word.russian || '',
        difficulty: 'medium' as const,
        createdAt: new Date()
      }))

      await db.words.bulkAdd(words as Word[])
      console.log(`Seeded ${words.length} words into database`)
    } catch (error) {
      console.error('Failed to seed words:', error)
    }
  } else {
    console.log('Words already seeded, skipping...')
  }
}

// Initialize database
export async function initializeDatabase(): Promise<void> {
  await initializeSettings()
  await seedWords()
}
