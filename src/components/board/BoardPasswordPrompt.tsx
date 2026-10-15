import { useState } from 'react'
import { Lock, Eye, EyeOff, Unlock, ShieldAlert } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
import { verifyBoardPassword } from '@/lib/supabase/board'
import { notify } from '@/lib/toast'
import type { Board } from '@/types/board'

interface BoardPasswordPromptProps {
  board: Board
  onUnlock: () => void
}

export default function BoardPasswordPrompt({
  board,
  onUnlock,
}: BoardPasswordPromptProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setLoading(true)
    setError('')

    const ok = await verifyBoardPassword(board, password)

    if (ok) {
      notify.success('Board unlocked!', 'Welcome')
      onUnlock()
    } else {
      setError('Incorrect password. Try again.')
      notify.error('Access denied', 'Wrong password')
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-md mx-auto">
        <Card
          padding="lg"
          className="border border-gray-200 dark:border-gray-800 shadow-lg"
        >
          <div className="text-center mb-6">
            <div className="size-16 rounded-2xl bg-linear-to-br from-amber-100 to-red-100 dark:from-amber-950/50 dark:to-red-950/50 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="size-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Protected
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This board is locked. Enter the password to access.
            </p>
            <p className="mt-2 text-xs font-mono text-gray-400 dark:text-gray-500">
              /b/{board.slug}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter board password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
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
              autoFocus
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={!password}
              leftIcon={!loading ? <Unlock className="size-4" /> : undefined}
            >
              {loading ? 'Verifying...' : 'Unlock Board'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}