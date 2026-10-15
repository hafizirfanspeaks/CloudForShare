import { useThemeStore } from '@/store/themeStore'

export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  }
}