import { getSettings } from '../db/settingsService'

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function scheduleDailyNotification(): Promise<void> {
  const settings = await getSettings()
  
  if (!settings.notificationsEnabled) {
    return
  }

  const [hours, minutes] = settings.notificationTime.split(':').map(Number)
  const now = new Date()
  const notificationTime = new Date()
  notificationTime.setHours(hours, minutes, 0, 0)

  // If the time has already passed today, schedule for tomorrow
  if (notificationTime <= now) {
    notificationTime.setDate(notificationTime.getDate() + 1)
  }

  const timeUntilNotification = notificationTime.getTime() - now.getTime()

  setTimeout(() => {
    showNotification()
    // Schedule the next day's notification
    scheduleDailyNotification()
  }, timeUntilNotification)
}

export function showNotification(): void {
  if (Notification.permission === 'granted') {
    new Notification('CincoPalabras Web', {
      body: 'Время изучать новые испанские слова! 🎯',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'daily-lesson',
      requireInteraction: false
    })
  }
}

export function cancelAllNotifications(): void {
  // Note: There's no direct way to cancel scheduled notifications in the browser
  // This would require using a service worker with background sync
  console.log('Notifications cancelled (requires page refresh to take effect)')
}

// iOS PWA notification limitations
export function getNotificationLimitations(): string[] {
  return [
    'iOS Safari: Notifications only work when the PWA is added to home screen',
    'iOS Safari: Notifications may not work in background mode',
    'iOS Safari: User must interact with the app first before notifications can be shown',
    'iOS Safari: Notifications are limited to 64 characters for title and body combined',
    'iOS Safari: Notification scheduling may not work reliably in background'
  ]
}



