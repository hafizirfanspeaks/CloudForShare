import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  Lock,
  Clock,
  Eye,
  EyeOff,
  ArrowLeft,
  Link as LinkIcon,
  Check,
  X,
  Loader2,
  Shield,
  Wand2,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
import { createBoard, isSlugAvailable } from '@/lib/supabase/board'
import { EXPIRY_OPTIONS, APP_URL } from '@/lib/constants'
import { notify } from '@/lib/toast'
import { isValidSlug } from '@/lib/utils/validators'
import { cn } from '@/lib/utils/cn'

export default function NewBoard() {
  const navigate = useNavigate()

  const [customSlug, setCustomSlug] = useState('')
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [useCustomSlug, setUseCustomSlug] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [expiresInHours, setExpiresInHours] = useState(0)
  const [loading, setLoading] = useState(false)

  // Check slug availability (debounced)
  useEffect(() => {
    if (!useCustomSlug || !customSlug) {
      setSlugAvailable(null)
      return
    }

    if (!isValidSlug(customSlug)) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    const timer = setTimeout(async () => {
      const available = await isSlugAvailable(customSlug)
      setSlugAvailable(available)
      setCheckingSlug(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [customSlug, useCustomSlug])

  const handleCreate = async () => {
    if (useCustomSlug && customSlug && !isValidSlug(customSlug)) {
      notify.error('Invalid slug', 'Use 3-50 letters, numbers, dashes')
      return
    }

    if (useCustomSlug && customSlug && slugAvailable === false) {
      notify.error('Slug taken', 'Try another one')
      return
    }

    setLoading(true)

    const { board, error } = await createBoard({
      slug: useCustomSlug && customSlug ? customSlug : undefined,
      password: password || undefined,
      expiresInHours,
    })

    if (error || !board) {
      notify.error('Failed to create board', error || undefined)
      setLoading(false)
      return
    }

    notify.success('Board created!', `Your board is ready`)
    navigate(`/b/${board.slug}`, { replace: true })
  }

  return (
    <>
      <SEO
        title="Create New Board"
        description="Create a new live board with custom options."
        url="/new"
        noindex
      />

      <div className="container-custom py-10 md:py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back to public board
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-4">
              <Wand2 className="size-3.5" />
              <span>Advanced options</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Create a New Board
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your board with a memorable link, password, and expiry.
            </p>
          </div>

          <Card padding="lg" className="border border-gray-200 dark:border-gray-800">
            <div className="space-y-6">
              {/* Custom Slug */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <LinkIcon className="size-4 text-gray-500 dark:text-gray-400" />
                    Custom Link
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomSlug((v) => !v)
                      setCustomSlug('')
                      setSlugAvailable(null)
                    }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
                      useCustomSlug
                        ? 'bg-brand-500'
                        : 'bg-gray-300 dark:bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block size-4 transform rounded-full bg-white transition-transform shadow',
                        useCustomSlug ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {useCustomSlug ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-mono pointer-events-none">
                        /b/
                      </span>
                      <input
                        type="text"
                        value={customSlug}
                        onChange={(e) =>
                          setCustomSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, '')
                              .slice(0, 50)
                          )
                        }
                        placeholder="my-awesome-board"
                        className={cn(
                          'w-full h-11 rounded-lg border bg-white dark:bg-gray-900 pl-10 pr-10 text-sm font-mono transition-all',
                          'text-gray-900 dark:text-white',
                          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                          'focus:outline-none focus:ring-2 focus:ring-offset-0',
                          slugAvailable === false
                            ? 'border-red-400 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-900/40'
                            : slugAvailable === true
                              ? 'border-green-400 dark:border-green-600 focus:ring-green-200 dark:focus:ring-green-900/40'
                              : 'border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-200 dark:focus:ring-brand-900/40'
                        )}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {checkingSlug && (
                          <Loader2 className="size-4 text-gray-400 animate-spin" />
                        )}
                        {!checkingSlug && slugAvailable === true && (
                          <Check className="size-4 text-green-500" />
                        )}
                        {!checkingSlug && slugAvailable === false && (
                          <X className="size-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    {customSlug && !isValidSlug(customSlug) && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Use 3-50 characters: letters, numbers, and dashes only
                      </p>
                    )}
                    {customSlug && isValidSlug(customSlug) && slugAvailable === true && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {APP_URL}/b/{customSlug} — available!
                      </p>
                    )}
                    {customSlug && isValidSlug(customSlug) && slugAvailable === false && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        This link is already taken
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A random short link will be generated automatically
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <Lock className="size-4 text-gray-500 dark:text-gray-400" />
                  Password <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Leave empty for public board"
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
                />
                {password && (
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    People will need this password to view the board
                  </p>
                )}
              </div>

              {/* Expiry */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <Clock className="size-4 text-gray-500 dark:text-gray-400" />
                  Expires in <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExpiresInHours(opt.value)}
                      className={cn(
                        'px-3.5 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer active:scale-95',
                        expiresInHours === opt.value
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                <Shield className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  <strong>Tip:</strong> Use a custom link and password for
                  private boards. Expiry is useful for temporary sharing.
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleCreate}
                loading={loading}
                fullWidth
                size="lg"
                leftIcon={!loading ? <Sparkles className="size-5" /> : undefined}
                disabled={
                  useCustomSlug &&
                  (!customSlug || !isValidSlug(customSlug) || slugAvailable !== true)
                }
              >
                {loading ? 'Creating board...' : 'Create Board'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}