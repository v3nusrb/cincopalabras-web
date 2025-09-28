import { db } from './database'
import { Word, Lesson, TestQuestion } from '../types'

export async function ensureLessonForToday(forceNext: boolean = false): Promise<Lesson> {
  const today = new Date().toISOString().split('T')[0]
  
  // Check if lesson for today already exists
  let existingLesson = await db.lessons.where('date').equals(today).first()
  
  if (existingLesson && !forceNext) {
    return existingLesson
  }

  // If forcing next day, mark current lesson as skipped
  if (forceNext && existingLesson) {
    await db.lessons.update(existingLesson.id, { isCompleted: true })
  }

  // Get all words that haven't been used in lessons yet
  const usedWordIds = await db.lessons.toArray().then(lessons => 
    lessons.flatMap(lesson => lesson.wordIds)
  )
  
  // If no words have been used yet, get all words
  let availableWords
  if (usedWordIds.length === 0) {
    availableWords = await db.words.toArray()
  } else {
    availableWords = await db.words
      .where('id')
      .noneOf(usedWordIds)
      .toArray()
  }

  if (availableWords.length === 0) {
    throw new Error('No more words available for lessons')
  }

  // Determine how many words for today's lesson
  const isFirstDay = usedWordIds.length === 0
  const wordsPerDay = isFirstDay ? 5 : 5
  const wordsToTake = Math.min(wordsPerDay, availableWords.length)

  // Select random words for the lesson
  const selectedWords = availableWords
    .sort(() => Math.random() - 0.5)
    .slice(0, wordsToTake)

  const lesson: Omit<Lesson, 'id'> = {
    date: today,
    wordIds: selectedWords.map(w => w.id),
    isCompleted: false,
    isViewed: false,
    createdAt: new Date()
  }

  const lessonId = await db.lessons.add(lesson as Lesson)
  return { ...lesson, id: lessonId } as Lesson
}

export async function buildDailyTest(lesson: Lesson): Promise<TestQuestion[]> {
  const words = await db.words.where('id').anyOf(lesson.wordIds).toArray()
  
  const testQuestions: TestQuestion[] = []
  
  for (const word of words) {
    // Get 2 other random words for wrong options
    const otherWords = await db.words
      .where('id')
      .noneOf([word.id])
      .toArray()
    
    const wrongOptions = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(w => w.russian)
    
    const options = [word.russian, ...wrongOptions]
      .sort(() => Math.random() - 0.5)

    testQuestions.push({
      wordId: word.id,
      spanish: word.spanish,
      transcription: word.transcription,
      correctAnswer: word.russian,
      options
    })
  }
  
  return testQuestions
}

export async function markLessonAsViewed(lessonId: number): Promise<void> {
  await db.lessons.update(lessonId, { isViewed: true })
}

export async function markLessonAsCompleted(lessonId: number): Promise<void> {
  await db.lessons.update(lessonId, { isCompleted: true })
}

export async function getTodayLesson(): Promise<Lesson | null> {
  const today = new Date().toISOString().split('T')[0]
  return await db.lessons.where('date').equals(today).first() || null
}

export async function getAllLessons(): Promise<Lesson[]> {
  return await db.lessons.orderBy('date').reverse().toArray()
}

export async function getWordsForLesson(lesson: Lesson): Promise<Word[]> {
  return await db.words.where('id').anyOf(lesson.wordIds).toArray()
}
