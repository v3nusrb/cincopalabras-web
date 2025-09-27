import { db } from './database'
import { Settings } from '../types'

export async function getSettings(): Promise<Settings> {
  let settings = await db.settings.get(1)
  
  if (!settings) {
    // Create default settings if none exist
    settings = {
      id: 1,
      notificationTime: '09:00',
      notificationsEnabled: false,
      dailyGoal: 5,
      theme: 'auto',
      language: 'ru',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.settings.add(settings)
  }
  
  return settings
}

export async function updateSettings(updates: Partial<Omit<Settings, 'id' | 'createdAt'>>): Promise<void> {
  await db.settings.update(1, {
    ...updates,
    updatedAt: new Date()
  })
}

export async function updateNotificationTime(time: string): Promise<void> {
  await updateSettings({ notificationTime: time })
}

export async function toggleNotifications(enabled: boolean): Promise<void> {
  await updateSettings({ notificationsEnabled: enabled })
}

export async function updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
  await updateSettings({ theme })
}

export async function updateLanguage(language: 'ru' | 'en'): Promise<void> {
  await updateSettings({ language })
}
