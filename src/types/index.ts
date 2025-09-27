export interface Word {
  id: number
  spanish: string
  transcription: string
  russian: string
  difficulty?: 'easy' | 'medium' | 'hard'
  createdAt: Date
}

export interface Lesson {
  id: number
  date: string // YYYY-MM-DD format
  wordIds: number[]
  isCompleted: boolean
  isViewed: boolean
  createdAt: Date
}

export interface TestSession {
  id: number
  lessonId: number
  wordId: number
  correctAnswer: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number // in milliseconds
  createdAt: Date
}

export interface Settings {
  id: number
  notificationTime: string // HH:MM format
  notificationsEnabled: boolean
  dailyGoal: number
  theme: 'light' | 'dark' | 'auto'
  language: 'ru' | 'en'
  createdAt: Date
  updatedAt: Date
}

export interface TestQuestion {
  wordId: number
  spanish: string
  transcription: string
  correctAnswer: string
  options: string[]
}

export interface DailyProgress {
  date: string
  wordsLearned: number
  testCompleted: boolean
  testScore: number
  totalWords: number
}

export interface AppState {
  currentLesson: Lesson | null
  currentTest: TestQuestion[]
  currentTestIndex: number
  testResults: TestSession[]
  settings: Settings
  isLoading: boolean
  error: string | null
}
