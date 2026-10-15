import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  userSet: boolean
  setTheme: (theme: Theme, options?: { user?: boolean }) => void
  toggleTheme: () => void
  init: () => void
}

const STORAGE_KEY = 'cloudforshare-theme'
const USER_SET_KEY = 'cloudforshare-theme-user-set'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  userSet: false,

  setTheme: (theme, options) => {
    localStorage.setItem(STORAGE_KEY, theme)
    if (options?.user) {
      localStorage.setItem(USER_SET_KEY, 'true')
      set({ userSet: true })
    }
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next, { user: true })
  },

  init: () => {
    const initial = getInitialTheme()
    const userSet = localStorage.getItem(USER_SET_KEY) === 'true'
    applyTheme(initial)
    set({ theme: initial, userSet })
  },
}))