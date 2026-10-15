/**
 * Returns theme based on time of day.
 * Dark: 7 PM – 6 AM
 * Light: 6 AM – 7 PM
 */
export function getTimeBasedTheme(): 'light' | 'dark' {
  const hour = new Date().getHours()
  return hour >= 19 || hour < 6 ? 'dark' : 'light'
}

/**
 * Auto-update theme every hour based on time.
 */
export function startAutoTheme(getTheme: () => string, setTheme: (t: 'light' | 'dark') => void) {
  const update = () => {
    // Only auto-switch if user hasn't manually overridden
    const stored = localStorage.getItem('cloudforshare-theme-user-set')
    if (stored === 'true') return

    const next = getTimeBasedTheme()
    if (getTheme() !== next) setTheme(next)
  }

  // Update immediately
  update()

  // Check every 15 minutes
  const interval = setInterval(update, 15 * 60 * 1000)
  return () => clearInterval(interval)
}