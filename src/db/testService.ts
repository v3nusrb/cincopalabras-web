import { db } from './database'
import { TestSession } from '../types'

export async function saveTestResult(
  lessonId: number,
  wordId: number,
  correctAnswer: string,
  userAnswer: string,
  timeSpent: number
): Promise<void> {
  const isCorrect = correctAnswer === userAnswer
  
  await db.testSessions.add({
    id: 0, // Dexie will auto-generate this
    lessonId,
    wordId,
    correctAnswer,
    userAnswer,
    isCorrect,
    timeSpent,
    createdAt: new Date()
  })
}

export async function getTestResultsForLesson(lessonId: number): Promise<TestSession[]> {
  return await db.testSessions.where('lessonId').equals(lessonId).toArray()
}

export async function getTestStatistics(): Promise<{
  totalTests: number
  correctAnswers: number
  accuracy: number
  averageTime: number
}> {
  const allTests = await db.testSessions.toArray()
  
  const totalTests = allTests.length
  const correctAnswers = allTests.filter(t => t.isCorrect).length
  const accuracy = totalTests > 0 ? (correctAnswers / totalTests) * 100 : 0
  const averageTime = totalTests > 0 
    ? allTests.reduce((sum, t) => sum + t.timeSpent, 0) / totalTests 
    : 0

  return {
    totalTests,
    correctAnswers,
    accuracy,
    averageTime
  }
}

export function calculateTestScore(results: TestSession[]): number {
  if (results.length === 0) return 0
  const correct = results.filter(r => r.isCorrect).length
  return Math.round((correct / results.length) * 100)
}
