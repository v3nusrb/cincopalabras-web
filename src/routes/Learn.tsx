import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { getWordsForLesson, markLessonAsViewed } from '../db/lessonService'
import { Word } from '../types'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function Learn() {
  const { currentLesson, isLoading } = useApp()
  const [words, setWords] = useState<Word[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isLoadingWords, setIsLoadingWords] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadWords = async () => {
      if (!currentLesson) return
      
      setIsLoadingWords(true)
      try {
        const lessonWords = await getWordsForLesson(currentLesson)
        setWords(lessonWords)
        
        // Mark lesson as viewed when user starts learning
        if (!currentLesson.isViewed) {
          await markLessonAsViewed(currentLesson.id)
        }
      } catch (error) {
        console.error('Failed to load words:', error)
      } finally {
        setIsLoadingWords(false)
      }
    }

    loadWords()
  }, [currentLesson])

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1)
    } else {
      navigate('/')
    }
  }

  const handleBack = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1)
    } else {
      navigate('/')
    }
  }

  if (isLoading || isLoadingWords) {
    return <LoadingSpinner />
  }

  if (!currentLesson || words.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Нет слов для изучения
        </h2>
        <p className="text-gray-600 mb-4">
          Попробуйте перейти к следующему дню
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вернуться в меню
        </button>
      </div>
    )
  }

  const currentWord = words[currentWordIndex]
  const progress = ((currentWordIndex + 1) / words.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Изучение слов
        </h1>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>{currentWordIndex + 1} из {words.length}</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Word Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center space-y-6">
          {/* Spanish Word */}
          <div>
            <h2 className="text-4xl font-bold text-blue-600 mb-2">
              {currentWord.spanish}
            </h2>
            <p className="text-lg text-gray-500 italic">
              {currentWord.transcription}
            </p>
          </div>

          {/* Russian Translation */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-2xl font-medium text-gray-900">
              {currentWord.russian}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </button>

        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {currentWordIndex < words.length - 1 ? 'Далее' : 'Завершить'}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Word List */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Слова в этом уроке:
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {words.map((word, index) => (
            <div
              key={word.id}
              className={`p-2 rounded ${
                index === currentWordIndex
                  ? 'bg-blue-100 text-blue-800'
                  : index < currentWordIndex
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-gray-600'
              }`}
            >
              <div className="font-medium">{word.spanish}</div>
              <div className="text-xs opacity-75">{word.russian}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
