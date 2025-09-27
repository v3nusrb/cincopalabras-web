import { useState, useEffect } from 'react'
import { useApp } from '../hooks/useApp'
import { getAllLessons, getWordsForLesson } from '../db/lessonService'
import { getTestResultsForLesson } from '../db/testService'
import { Lesson, Word, TestSession } from '../types'
import { LoadingSpinner } from '../components/LoadingSpinner'

interface LessonWithWords extends Lesson {
  words: Word[]
  testResults: TestSession[]
  testScore: number
}

export function AllLearned() {
  const { isLoading } = useApp()
  const [lessons, setLessons] = useState<LessonWithWords[]>([])
  const [isLoadingLessons, setIsLoadingLessons] = useState(true)

  useEffect(() => {
    const loadLessons = async () => {
      setIsLoadingLessons(true)
      try {
        const allLessons = await getAllLessons()
        const lessonsWithWords: LessonWithWords[] = []

        for (const lesson of allLessons) {
          const words = await getWordsForLesson(lesson)
          const testResults = await getTestResultsForLesson(lesson.id)
          const testScore = testResults.length > 0 
            ? Math.round((testResults.filter(r => r.isCorrect).length / testResults.length) * 100)
            : 0

          lessonsWithWords.push({
            ...lesson,
            words,
            testResults,
            testScore
          })
        }

        setLessons(lessonsWithWords)
      } catch (error) {
        console.error('Failed to load lessons:', error)
      } finally {
        setIsLoadingLessons(false)
      }
    }

    loadLessons()
  }, [])

  if (isLoading || isLoadingLessons) {
    return <LoadingSpinner />
  }

  const totalWords = lessons.reduce((sum, lesson) => sum + lesson.words.length, 0)
  // const completedLessons = lessons.filter(lesson => lesson.isCompleted).length
  const averageScore = lessons.length > 0 
    ? Math.round(lessons.reduce((sum, lesson) => sum + lesson.testScore, 0) / lessons.length)
    : 0

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Изученные слова
        </h1>
        <p className="text-gray-600">
          Все ваши уроки и прогресс
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {lessons.length}
          </div>
          <div className="text-sm text-gray-600">Уроков</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {totalWords}
          </div>
          <div className="text-sm text-gray-600">Слов изучено</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {averageScore}%
          </div>
          <div className="text-sm text-gray-600">Средний балл</div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Пока нет изученных уроков
            </h3>
            <p className="text-gray-600">
              Начните изучение с первого урока
            </p>
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Урок {index + 1}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(lesson.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    lesson.isCompleted
                      ? 'bg-green-100 text-green-800'
                      : lesson.isViewed
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {lesson.isCompleted ? 'Завершен' : lesson.isViewed ? 'Изучен' : 'Не начат'}
                  </span>
                  {lesson.testScore > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {lesson.testScore}%
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Слов в уроке</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {lesson.words.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Результат теста</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {lesson.testScore > 0 ? `${lesson.testScore}%` : 'Не пройден'}
                  </div>
                </div>
              </div>

              {/* Words Grid */}
              <div className="grid grid-cols-2 gap-2">
                {lesson.words.map((word) => (
                  <div key={word.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 text-sm">
                      {word.spanish}
                    </div>
                    <div className="text-xs text-gray-500 italic mb-1">
                      {word.transcription}
                    </div>
                    <div className="text-sm text-gray-700">
                      {word.russian}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
