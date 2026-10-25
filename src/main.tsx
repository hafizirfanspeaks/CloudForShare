import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import App from './App'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { startAutoTheme } from '@/lib/themeAuto'
import './index.css'

function Root() {
  const initAuth = useAuthStore((s) => s.init)
  const initTheme = useThemeStore((s) => s.init)
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    initTheme()
    initAuth()

    const cleanupAuto = startAutoTheme(
      () => useThemeStore.getState().theme,
      (t) => useThemeStore.getState().setTheme(t)
    )

    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((err) => console.log('SW failed:', err))
      })
    }

    return () => cleanupAuto()
  }, [initTheme, initAuth])

  return (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <Toaster
            position="top-right"
            theme={theme}
            richColors
            closeButton
            duration={3000}
            toastOptions={{
              className: 'text-sm',
              style: { borderRadius: '12px' },
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)