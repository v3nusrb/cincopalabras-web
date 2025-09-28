import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export function Menu() {
  const { currentLesson, isLoading, error, nextDay } = useApp()

  // Debug info
  console.log('Menu render:', { currentLesson, isLoading, error })

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Загрузка...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Ошибка</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Перезагрузить
        </button>
      </div>
    )
  }

  // If no lesson available, show a simple message
  if (!currentLesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Нет урока на сегодня
        </h2>
        <p className="text-gray-600 mb-4">
          Попробуйте перейти к следующему дню
        </p>
        <button
          onClick={nextDay}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Следующий день
        </button>
      </div>
    )
  }

  const canStartLesson = currentLesson && !currentLesson.isViewed
  const canStartTest = currentLesson && currentLesson.isViewed && !currentLesson.isCompleted

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CincoPalabras Web
        </h1>
        <p className="text-gray-600">
          Изучайте испанские слова каждый день
        </p>
      </div>

      <div className="grid gap-4">
        {/* Lesson Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Новые слова
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {currentLesson?.wordIds.length || 0} слов
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">
            {currentLesson?.isViewed 
              ? 'Вы уже изучили слова на сегодня'
              : 'Изучите новые испанские слова с транскрипцией и переводом'
            }
          </p>

          <Link
            to="/learn"
            className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors ${
              canStartLesson
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentLesson?.isViewed ? 'Повторить слова' : 'Изучить слова'}
          </Link>
        </div>

        {/* Test Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Тест
            </h2>
            <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
              currentLesson?.isCompleted
                ? 'bg-green-100 text-green-800'
                : canStartTest
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {currentLesson?.isCompleted ? 'Пройден' : canStartTest ? 'Доступен' : 'Заблокирован'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">
            {currentLesson?.isCompleted
              ? 'Вы уже прошли тест на сегодня'
              : canStartTest
              ? 'Проверьте свои знания в тесте'
              : 'Сначала изучите новые слова'
            }
          </p>

          <Link
            to="/test"
            className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors ${
              canStartTest
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentLesson?.isCompleted ? 'Повторить тест' : 'Пройти тест'}
          </Link>
        </div>

        {/* Next Day Button */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Следующий день
          </h3>
          <p className="text-gray-600 mb-4">
            Хотите изучить больше слов уже сегодня?
          </p>
          <button
            onClick={nextDay}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Следующий день
          </button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Прогресс
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {currentLesson?.wordIds.length || 0}
            </div>
            <div className="text-sm text-gray-600">Слов сегодня</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {currentLesson?.isCompleted ? '100%' : '0%'}
            </div>
            <div className="text-sm text-gray-600">Тест пройден</div>
          </div>
        </div>
      </div>
    </div>
  )
}
