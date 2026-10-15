import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
// import GoogleButton from '@/components/common/GoogleButton'
import { signIn } from '@/lib/supabase/auth'
import { isValidEmail } from '@/lib/utils/validators'
import { notify } from '@/lib/toast'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!loading) {
      if (success) setProgress(100)
      else setProgress(0)
      return
    }

    setProgress(8)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p
        return p + Math.random() * 12
      })
    }, 180)

    return () => clearInterval(interval)
  }, [loading, success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      notify.error('Invalid email', 'Please enter a valid email address')
      return
    }
    if (!password) {
      notify.error('Password required', 'Please enter your password')
      return
    }

    setLoading(true)
    const { success: ok, error } = await signIn(email, password)

    if (!ok) {
      setLoading(false)
      notify.error('Login failed', error || 'Invalid credentials')
      return
    }

    setSuccess(true)
    notify.success('Welcome back!', 'Redirecting to your dashboard...')
    setTimeout(() => navigate(from, { replace: true }), 700)
  }

  return (
    <>
      <SEO
        title="Login"
        description="Sign in to your CloudForShare account."
        url="/login"
        noindex
      />

      <div className="container-custom py-12 md:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side — Feature Highlights */}
          <div className="hidden md:block">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Back to board
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-5">
              <Sparkles className="size-3.5" />
              <span>Free forever</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Welcome back to{' '}
              <span className="bg-linear-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
                CloudForShare
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Sign in to access your dashboard and manage all your boards in
              one place.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: 'Secure & private',
                  desc: 'Your data is encrypted end-to-end',
                },
                {
                  icon: Zap,
                  title: 'Lightning fast',
                  desc: 'Real-time sync across all devices',
                },
                {
                  icon: CheckCircle2,
                  title: 'Unlimited boards',
                  desc: 'Create, manage, and share as many as you want',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center shrink-0">
                    <Icon className="size-4 text-brand-600 dark:text-brand-300" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side — Form */}
          <div className="max-w-md w-full mx-auto md:mx-0">
            <Link
              to="/"
              className="md:hidden inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Back to board
            </Link>

            <Card
              padding="lg"
              className="border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-gray-950/50"
            >
              {loading && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Signing in...
                    </span>
                    <span className="text-xs font-mono font-medium text-brand-600 dark:text-brand-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-brand-500 to-purple-600 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Google Button */}
              {/* <GoogleButton disabled={loading || success} />

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    or continue with email
                  </span>
                </div>
              </div> */}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="size-4" />}
                  autoComplete="email"
                  autoFocus
                  disabled={loading || success}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="size-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  }
                  autoComplete="current-password"
                  disabled={loading || success}
                />

                {success && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900">
                    <CheckCircle2 className="size-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800 dark:text-green-300">
                      Login successful! Redirecting...
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={success}
                >
                  {success ? 'Redirecting...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </Card>

            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              You don't need an account to use the public board.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}