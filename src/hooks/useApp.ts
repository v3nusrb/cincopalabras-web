import { useState, useEffect, useCallback } from 'react'
import { AppState, Lesson } from '../types'
import { initializeDatabase } from '../db/database'
import { ensureLessonForToday, buildDailyTest, getTodayLesson } from '../db/lessonService'
import { getSettings } from '../db/settingsService'
import { requestNotificationPermission, scheduleDailyNotification } from '../utils/notifications'

export function useApp() {
  const [state, setState] = useState<AppState>({
    currentLesson: null,
    currentTest: [],
    currentTestIndex: 0,
    testResults: [],
    settings: {
      id: 1,
      notificationTime: '09:00',
      notificationsEnabled: false,
      dailyGoal: 5,
      theme: 'auto',
      language: 'ru',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    isLoading: true,
    error: null
  })

  const initializeApp = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Initialize database
      await initializeDatabase()
      
      // Load settings
      const settings = await getSettings()
      
      // Request notification permission
      if (settings.notificationsEnabled) {
        await requestNotificationPermission()
        scheduleDailyNotification()
      }
      
      // Load today's lesson
      let lesson = await getTodayLesson()
      if (!lesson) {
        lesson = await ensureLessonForToday()
      }
      
      setState(prev => ({
        ...prev,
        settings,
        currentLesson: lesson,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      }))
    }
  }, [])

  const loadTest = useCallback(async (lesson: Lesson) => {
    try {
      const test = await buildDailyTest(lesson)
      setState(prev => ({
        ...prev,
        currentTest: test,
        currentTestIndex: 0,
        testResults: []
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load test'
      }))
    }
  }, [])

  const nextDay = useCallback(async () => {
    try {
      const lesson = await ensureLessonForToday(true)
      setState(prev => ({
        ...prev,
        currentLesson: lesson,
        currentTest: [],
        currentTestIndex: 0,
        testResults: []
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load next day'
      }))
    }
  }, [])

  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  return {
    ...state,
    loadTest,
    nextDay,
    setState
  }
}
