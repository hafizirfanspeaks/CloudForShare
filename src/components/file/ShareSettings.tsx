import { useState } from 'react'
import {
  Clock,
  Lock,
  Download,
  Link as LinkIcon,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useFileStore } from '@/store/fileStore'
import { EXPIRY_OPTIONS, DOWNLOAD_LIMIT_OPTIONS, APP_URL } from '@/lib/constants'
import Input from '@/components/common/Input'
import { cn } from '@/lib/utils/cn'

export default function ShareSettings() {
  const { settings, updateSettings } = useFileStore()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-5">
      {/* Expiry */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Clock className="size-4 text-gray-500 dark:text-gray-400" />
          File expires in
        </label>
        <div className="flex flex-wrap gap-2">
          {EXPIRY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateSettings({ expiresInHours: opt.value })}
              className={cn(
                'px-3.5 py-2 text-xs font-medium rounded-lg border transition-all',
                settings.expiresInHours === opt.value
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Download Limit */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Download className="size-4 text-gray-500 dark:text-gray-400" />
          Download limit
        </label>
        <div className="flex flex-wrap gap-2">
          {DOWNLOAD_LIMIT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateSettings({ downloadLimit: opt.value })}
              className={cn(
                'px-3.5 py-2 text-xs font-medium rounded-lg border transition-all',
                settings.downloadLimit === opt.value
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Password */}
      <div>
        <Input
          label="Password (optional)"
          type={showPassword ? 'text' : 'password'}
          placeholder="Leave empty for no password"
          value={settings.password}
          onChange={(e) => updateSettings({ password: e.target.value })}
          leftIcon={<Lock className="size-4" />}
          rightIcon={
            settings.password ? (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            ) : null
          }
          helperText={
            settings.password
              ? 'Share this password separately with the recipient'
              : 'Only people with this password can download'
          }
        />

        {settings.password && settings.password.length < 4 && (
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="size-3" />
            Password should be at least 4 characters
          </p>
        )}
      </div>

      {/* Custom Slug */}
      <div>
        <Input
          label="Custom link (optional)"
          type="text"
          placeholder="my-awesome-file"
          value={settings.customSlug}
          onChange={(e) =>
            updateSettings({
              customSlug: e.target.value
                .replace(/[^a-zA-Z0-9-_]/g, '')
                .slice(0, 50),
            })
          }
          leftIcon={<LinkIcon className="size-4" />}
          helperText={
            settings.customSlug
              ? `Your link: ${APP_URL}/share/${settings.customSlug}`
              : `Leave empty for random link • ${APP_URL}/share/abc123`
          }
        />
        {settings.customSlug && settings.customSlug.length < 3 && (
          <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="size-3" />
            Custom link should be at least 3 characters
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
        <AlertCircle className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong className="font-semibold">Pro tip:</strong> For sensitive
          files, always use a strong password and set a short expiry time. Files
          are auto-deleted after expiry.
        </div>
      </div>
    </div>
  )
}