import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { buildDailyTest, markLessonAsCompleted } from '../db/lessonService'
import { saveTestResult, calculateTestScore } from '../db/testService'
import { TestQuestion, TestSession } from '../types'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function Test() {
  const { currentLesson, isLoading } = useApp()
  const [test, setTest] = useState<TestQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<TestSession[]>([])
  const [isTestCompleted, setIsTestCompleted] = useState(false)
  const [isLoadingTest, setIsLoadingTest] = useState(true)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const navigate = useNavigate()

  useEffect(() => {
    const loadTest = async () => {
      if (!currentLesson) return
      
      setIsLoadingTest(true)
      try {
        const testQuestions = await buildDailyTest(currentLesson)
        setTest(testQuestions)
        setQuestionStartTime(Date.now())
      } catch (error) {
        console.error('Failed to load test:', error)
      } finally {
        setIsLoadingTest(false)
      }
    }

    loadTest()
  }, [currentLesson])

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = async () => {
    if (!selectedAnswer || !currentLesson) return

    const currentQuestion = test[currentQuestionIndex]
    const timeSpent = Date.now() - questionStartTime
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    // Save test result
    const testResult: Omit<TestSession, 'id'> = {
      lessonId: currentLesson.id,
      wordId: currentQuestion.wordId,
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer: selectedAnswer,
      isCorrect,
      timeSpent,
      createdAt: new Date()
    }

    setTestResults(prev => [...prev, testResult as TestSession])
    await saveTestResult(
      currentLesson.id,
      currentQuestion.wordId,
      currentQuestion.correctAnswer,
      selectedAnswer,
      timeSpent
    )

    if (currentQuestionIndex < test.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setQuestionStartTime(Date.now())
    } else {
      // Test completed
      setIsTestCompleted(true)
      await markLessonAsCompleted(currentLesson.id)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setTestResults([])
    setIsTestCompleted(false)
    setQuestionStartTime(Date.now())
  }

  if (isLoading || isLoadingTest) {
    return <LoadingSpinner />
  }

  if (!currentLesson || test.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Нет теста для прохождения
        </h2>
        <p className="text-gray-600 mb-4">
          Сначала изучите новые слова
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

  if (isTestCompleted) {
    const score = calculateTestScore(testResults)
    const correctAnswers = testResults.filter(r => r.isCorrect).length

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Тест завершен!
          </h1>
          <p className="text-gray-600">
            Отличная работа!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-green-600">
              {score}%
            </div>
            <div className="text-lg text-gray-700">
              Правильных ответов: {correctAnswers} из {test.length}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Вернуться в меню
          </button>
          <button
            onClick={handleRestart}
            className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Пройти тест снова
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = test[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / test.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Тест
        </h1>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Вопрос {currentQuestionIndex + 1} из {test.length}</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentQuestion.spanish}
            </h2>
            <p className="text-lg text-gray-500 italic">
              {currentQuestion.transcription}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-lg font-medium text-gray-700 mb-4">
              Выберите правильный перевод:
            </p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full py-3 px-4 rounded-lg border-2 transition-colors ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            selectedAnswer
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuestionIndex < test.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
        </button>
      </div>
    </div>
  )
}
