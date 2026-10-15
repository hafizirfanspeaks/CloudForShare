import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Cloud,
  Plus,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
  MessageSquare,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/common/Button'
import EmailButton from '@/components/common/EmailButton'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { signOut } from '@/lib/supabase/auth'
import { notify } from '@/lib/toast'
import { ROUTES, COMPANY_EMAIL } from '@/lib/constants'

const navLinks = [
  { label: 'Board', to: ROUTES.HOME },
  { label: 'Upload', to: ROUTES.UPLOAD },
  { label: 'Dashboard', to: ROUTES.DASHBOARD },
  { label: 'About', to: ROUTES.ABOUT },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    const toastId = notify.loading('Signing out...')
    const { success, error } = await signOut()
    notify.dismiss(toastId)

    if (success) {
      notify.success('Signed out successfully', 'See you soon!')
      navigate('/')
    } else {
      notify.error('Sign out failed', error || undefined)
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-800'
          : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md'
      )}
    >
      {/* Top mini bar with email */}
      <div className="hidden md:block border-b border-gray-100 dark:border-gray-900 bg-linear-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
        <div className="container-custom py-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              ✨ Free file sharing — no signup required
            </span>
            <EmailButton
              className="inline-flex items-center gap-1.5 font-medium text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200 transition-colors cursor-pointer"
              subject={`Inquiry from CloudForShare`}
              title={`Contact Us`}
            >
              <Mail className="size-3" />
              <span>{COMPANY_EMAIL}</span>
            </EmailButton>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white hover:opacity-80 transition-opacity cursor-pointer shrink-0"
          >
            <span className="size-9 rounded-lg bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
              <Cloud className="size-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="hidden sm:inline">CloudForShare</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer',
                    isActive
                      ? 'text-brand-600 bg-brand-50 dark:text-brand-300 dark:bg-brand-950/60'
                      : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50/50 dark:text-gray-200 dark:hover:text-brand-300 dark:hover:bg-gray-800'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="size-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-all duration-150 cursor-pointer active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* Contact Us — HIGHLIGHTED */}
            <Link
              to={ROUTES.CONTACT}
              className="relative inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-semibold text-white transition-all duration-150 cursor-pointer active:scale-95 hover:shadow-lg"
              style={{
                background:
                  'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
                boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.35)',
              }}
              title="Contact us — hire, sponsor, or say hi!"
            >
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-green-400 animate-pulse" />
              <MessageSquare className="size-3.5" />
              <span>Contact Us</span>
            </Link>

            {user ? (
              <>
                <Link to={ROUTES.NEW}>
                  <Button size="sm" leftIcon={<Plus className="size-4" />}>
                    New Board
                  </Button>
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="size-9 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-all duration-150 cursor-pointer active:scale-95"
                    aria-label="User menu"
                  >
                    <UserIcon className="size-4" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl z-50 overflow-hidden animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                            Signed in as
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          to={ROUTES.DASHBOARD}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <UserIcon className="size-4" />
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer text-left"
                        >
                          <LogOut className="size-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/60 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-150 cursor-pointer active:scale-95"
                >
                  Login
                </Link>

                <Link to={ROUTES.NEW}>
                  <Button size="sm" leftIcon={<Plus className="size-4" />}>
                    New Board
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center size-10 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-white dark:bg-gray-950',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container-custom py-4 space-y-2 border-t border-gray-100 dark:border-gray-800">
          {/* Email in mobile menu */}
          <EmailButton
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 cursor-pointer w-full text-left"
            subject={`Inquiry from CloudForShare`}
            title={`Contact Us`}
          >
            <Mail className="size-4" />
            <span className="break-all">{COMPANY_EMAIL}</span>
          </EmailButton>

          {user && (
            <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Signed in as
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.email}
              </p>
            </div>
          )}

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'text-brand-600 bg-brand-50 dark:text-brand-300 dark:bg-brand-950/60'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Contact — Highlighted (Mobile) */}
          <Link
            to={ROUTES.CONTACT}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer active:scale-[0.98] transition-transform"
            style={{
              background:
                'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
              boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.35)',
            }}
          >
            <MessageSquare className="size-4" />
            Contact Us
            <span className="ml-auto size-2 rounded-full bg-green-400 animate-pulse" />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>

          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <Button
                variant="outline"
                fullWidth
                onClick={handleSignOut}
                leftIcon={<LogOut className="size-4" />}
              >
                Sign out
              </Button>
            ) : (
              <Link to={ROUTES.LOGIN}>
                <button
                  type="button"
                  className="w-full h-11 inline-flex items-center justify-center rounded-lg text-sm font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-all cursor-pointer active:scale-[0.98]"
                >
                  Login
                </button>
              </Link>
            )}
            <Link to={ROUTES.NEW}>
              <Button fullWidth leftIcon={<Plus className="size-4" />}>
                New Board
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}