import { useState } from 'react'
import {
  Lock,
  Clock,
  Eye,
  EyeOff,
  Save,
  Shield,
  X,
  AlertCircle,
} from 'lucide-react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { notify } from '@/lib/toast'
import {
  setBoardPassword,
  setBoardExpiry,
  verifyBoardPassword,
} from '@/lib/supabase/board'
import { EXPIRY_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'
import type { Board } from '@/types/board'

interface BoardSettingsProps {
  board: Board
  onClose: () => void
  onUpdated: (updates: Partial<Board>) => void
}

export default function BoardSettings({
  board,
  onClose,
  onUpdated,
}: BoardSettingsProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const needCurrentPassword = !!board.password_hash
  const [expiresInHours, setExpiresInHours] = useState(() => {
    if (!board.expires_at) return 0
    const hoursLeft = Math.max(
      0,
      Math.round(
        (new Date(board.expires_at).getTime() - Date.now()) / 3600000
      )
    )
    return hoursLeft
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (needCurrentPassword && board.password_hash) {
      const ok = await verifyBoardPassword(board, currentPassword)
      if (!ok) {
        notify.error('Incorrect current password')
        return
      }
    }

    if (password) {
      if (password.length < 4) {
        notify.error('Password too short', 'Use at least 4 characters')
        return
      }
      if (password !== confirmPassword) {
        notify.error('Passwords do not match')
        return
      }
    }

    setLoading(true)
    const toastId = notify.loading('Saving settings...')

    const pwdResult = await setBoardPassword(board.id, password)
    if (!pwdResult.success) {
      notify.dismiss(toastId)
      notify.error('Failed to save password', pwdResult.error || undefined)
      setLoading(false)
      return
    }

    const expResult = await setBoardExpiry(board.id, expiresInHours)
    if (!expResult.success) {
      notify.dismiss(toastId)
      notify.error('Failed to save expiry', expResult.error || undefined)
      setLoading(false)
      return
    }

    notify.dismiss(toastId)
    notify.success('Settings saved!')

    onUpdated({
      password_hash: password ? 'updated' : null,
      expires_at:
        expiresInHours > 0
          ? new Date(Date.now() + expiresInHours * 3600000).toISOString()
          : null,
    })
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
              <Shield className="size-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Board Settings
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password & expiry options
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Current password verification */}
          {needCurrentPassword && board.password_hash && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-300">
                  This board has a password. Enter it to change settings.
                </div>
              </div>
              <Input
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                leftIcon={<Lock className="size-4" />}
              />
            </div>
          )}

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              New Password <span className="text-gray-400">(optional)</span>
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Leave empty to remove password"
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
              <div className="mt-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="size-4" />}
                />
              </div>
            )}
            {password && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Anyone opening this board will need this password
              </p>
            )}
          </div>

          {/* Expiry */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              <Clock className="size-4 text-gray-500 dark:text-gray-400" />
              Board expires in
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPIRY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExpiresInHours(opt.value)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer active:scale-95',
                    expiresInHours === opt.value
                      ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Board will be permanently deleted after expiry
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={loading}
            leftIcon={!loading ? <Save className="size-4" /> : undefined}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}