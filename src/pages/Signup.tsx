import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  MailCheck,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
// import GoogleButton from '@/components/common/GoogleButton'
import { signUp } from '@/lib/supabase/auth'
import { isValidEmail, isValidPassword } from '@/lib/utils/validators'
import { notify } from '@/lib/toast'

export default function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!loading) {
      if (success) setProgress(100)
      else setProgress(0)
      return
    }
    setProgress(8)
    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 12))
    }, 180)
    return () => clearInterval(interval)
  }, [loading, success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      notify.error('Invalid email', 'Please enter a valid email address')
      return
    }
    if (!isValidPassword(password)) {
      notify.error(
        'Weak password',
        'Password must be at least 8 characters with letters and numbers'
      )
      return
    }
    if (password !== confirmPassword) {
      notify.error('Passwords do not match', 'Please re-enter your password')
      return
    }

    setLoading(true)
    const {
      success: ok,
      error,
      needsVerification: needs,
    } = await signUp(email, password)

    if (!ok) {
      setLoading(false)
      notify.error('Signup failed', error || undefined)
      return
    }

    setSuccess(true)
    setNeedsVerification(needs)

    if (!needs) {
      notify.success('Account created!', 'Welcome to CloudForShare')
      setTimeout(() => navigate('/dashboard', { replace: true }), 800)
    } else {
      notify.success('Account created!', 'Please verify your email')
    }
  }

  if (success && needsVerification) {
    return (
      <>
        <SEO title="Verify Email" noindex />
        <div className="container-custom py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <Card
              padding="lg"
              className="border border-gray-200 dark:border-gray-800 text-center shadow-lg"
            >
              <div className="size-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center mx-auto mb-5">
                <MailCheck className="size-8 text-brand-600 dark:text-brand-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check your email
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                We sent a verification link to
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-6">
                {email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Click the link in the email to activate your account. It may
                take a minute to arrive — check your spam folder too.
              </p>
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Sign Up"
        description="Create your free CloudForShare account."
        url="/signup"
        noindex
      />

      <div className="container-custom py-12 md:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left — Feature highlights */}
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
              <span>Free forever • No credit card</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Join{' '}
              <span className="bg-linear-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
                CloudForShare
              </span>{' '}
              today
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Create your free account and manage all your boards in one
              place. No credit card required.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  title: 'Unlimited boards',
                  desc: 'Create as many boards as you need',
                },
                {
                  icon: Shield,
                  title: 'Secure accounts',
                  desc: 'Your boards saved under your account',
                },
                {
                  icon: Zap,
                  title: 'Real-time sync',
                  desc: 'Changes appear instantly everywhere',
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

          {/* Right — Form */}
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
                      Creating account...
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
                  Create account
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Save and manage all your boards
                </p>
              </div>

              {/* Google Button */}
              {/* <GoogleButton
                label="Sign up with Google"
                disabled={loading || success}
              /> */}

              {/* <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    or sign up with email
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
                  disabled={loading}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, letters + numbers"
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
                  autoComplete="new-password"
                  disabled={loading}
                />

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="size-4" />}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={success}
                >
                  {success ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}