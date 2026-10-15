import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Download,
  Lock,
  Clock,
  FileText,
  FileCode2,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  QrCode,
  Shield,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
import QRCodeDisplay from '@/components/share/QRCodeDisplay'
import CopyButton from '@/components/share/CopyButton'
import { formatBytes, getFileExtension } from '@/lib/utils/formatBytes'
import { formatDateTime, isExpired } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import {
  getShare,
  verifyPassword,
  isShareValid,
  incrementDownloadCount,
} from '@/lib/supabase/database'
import { downloadFile } from '@/lib/supabase/storage'
import { APP_URL } from '@/lib/constants'
import type { ShareWithFiles } from '@/types/supabase'

type PageState = 'loading' | 'password' | 'ready' | 'error'

export default function Share() {
  const { id } = useParams<{ id: string }>()
  const [state, setState] = useState<PageState>('loading')
  const [share, setShare] = useState<ShareWithFiles | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set())

  const shareUrl = `${APP_URL}/share/${id}`

  // Fetch share on mount
  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setState('loading')
      const { share: data, error } = await getShare(id!)
      if (cancelled) return

      if (error || !data) {
        setErrorMsg(error || 'Share not found')
        setState('error')
        return
      }

      const validation = isShareValid(data)
      if (!validation.valid) {
        setErrorMsg(validation.reason || 'This share is no longer available')
        setState('error')
        return
      }

      setShare(data)

      if (data.password_hash) {
        setState('password')
      } else {
        setState('ready')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  // Handle password submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!share || !password) return

    const ok = await verifyPassword(share, password)
    if (ok) {
      setPasswordError('')
      setState('ready')
    } else {
      setPasswordError('Incorrect password. Try again.')
    }
  }

  // Handle file download
  const handleDownload = async (file: ShareWithFiles['files'][0]) => {
    if (!share) return
    setDownloadingId(file.id)

    try {
      const { blob, error } = await downloadFile(file.storage_path)
      if (error || !blob) {
        setErrorMsg(error || 'Download failed')
        setDownloadingId(null)
        return
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadedIds((prev) => new Set(prev).add(file.id))
      await incrementDownloadCount(share.id)
    } catch (err) {
      console.error(err)
    } finally {
      setDownloadingId(null)
    }
  }

  // =================== LOADING ===================
  if (state === 'loading') {
    return (
      <div className="min-h-150 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand-500" />
      </div>
    )
  }

  // =================== ERROR ===================
  if (state === 'error') {
    return (
      <>
        <SEO title="Share Not Available" noindex />
        <div className="container-custom py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="size-16 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="size-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Share Not Available
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMsg}</p>
            <Link to="/upload">
              <Button leftIcon={<ArrowLeft className="size-4" />}>
                Share Your Own Content
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  // =================== PASSWORD ===================
  if (state === 'password') {
    return (
      <>
        <SEO title="Password Required" noindex />
        <div className="container-custom py-16">
          <div className="max-w-md mx-auto">
            <Card
              padding="lg"
              className="border border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="size-14 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mx-auto mb-4">
                  <Lock className="size-7 text-brand-600 dark:text-brand-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Password Protected
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the password to access this content.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
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
                />

                <Button type="submit" fullWidth size="lg" disabled={!password}>
                  Unlock
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </>
    )
  }

  // =================== READY ===================
  if (!share) return null

  const expired = share.expires_at ? isExpired(share.expires_at) : false
  const totalSize = share.files.reduce((sum, f) => sum + f.size, 0)
  const isTextShare =
    share.content_type === 'text' || share.content_type === 'code'
  const isFileShare = share.content_type === 'file'
  const fileCount = share.files.length

  const firstFile = share.files[0]
  const singleImage =
    isFileShare && fileCount === 1 && firstFile.mime_type?.startsWith('image/')
  const singlePdf =
    isFileShare && fileCount === 1 && firstFile.mime_type === 'application/pdf'
  const singleText =
    isFileShare &&
    fileCount === 1 &&
    (firstFile.mime_type?.startsWith('text/') ||
      firstFile.name.endsWith('.txt') ||
      firstFile.name.endsWith('.md'))

  const headerTitle = isTextShare
    ? share.content_type === 'code'
      ? 'Shared Code'
      : 'Shared Text'
    : singleImage
      ? 'Shared Image'
      : singlePdf
        ? 'Shared PDF'
        : fileCount === 1
          ? 'Shared File'
          : `${fileCount} Files Shared`

  const headerSubtitle = isTextShare
    ? `${share.content_type === 'code' ? 'Code' : 'Text'} • ${share.content?.length || 0} characters`
    : `${fileCount} ${fileCount === 1 ? 'file' : 'files'} • ${formatBytes(totalSize)}`

  return (
    <>
      <SEO
        title={headerTitle}
        description="Content shared via CloudForShare."
        url={`/share/${id}`}
        noindex
      />

      <div className="container-custom py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Share your own content
          </Link>

          <Card
            padding="lg"
            className="border border-gray-200 dark:border-gray-800 shadow-lg"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="size-14 rounded-2xl bg-linear-to-br from-brand-100 to-purple-100 dark:from-brand-950/50 dark:to-purple-950/50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="size-7 text-brand-600 dark:text-brand-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {headerTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {headerSubtitle}
              </p>
            </div>

            {/* ═══════════════════════════════════════════════
                SHARE SECTION — Always Visible
            ═══════════════════════════════════════════════ */}
            <div className="mb-6 space-y-4">
              {/* Unique Name Message */}
              <div className="relative p-4 md:p-5 rounded-2xl bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 text-white overflow-hidden shadow-lg">
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-white/20 blur-2xl" />

                <div className="relative flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-bold mb-1">
                      ✨ Your private share link is ready!
                    </p>
                    <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                      Share this link with{' '}
                      <strong>only the people you trust</strong>. It's private,
                      secure, and expires automatically — no one else can find
                      it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Link + QR Card */}
              <div className="rounded-2xl bg-white dark:bg-gray-900 border-2 border-brand-200 dark:border-brand-900 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left — Link */}
                  <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="size-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
                        <LinkIcon className="size-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                          Share Link
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          Copy & send to anyone
                        </p>
                      </div>
                    </div>

                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-700 dark:text-gray-300 font-mono focus:outline-none focus:border-brand-500 cursor-pointer mb-3"
                    />

                    <CopyButton value={shareUrl} label="Copy Link" fullWidth />

                    <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-500 dark:text-gray-400">
                      <Lock className="size-3" />
                      <span>Anyone with the link can view this content</span>
                    </div>
                  </div>

                  {/* Right — QR */}
                  <div className="p-5 md:p-6 flex flex-col items-center justify-center bg-linear-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center">
                        <QrCode className="size-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                          Scan QR Code
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          Open on any device
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-2xl shadow-md">
                      <QRCodeDisplay value={shareUrl} size={160} />
                    </div>

                    <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 text-center">
                      📱 Open camera & scan to view instantly
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Tip */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
                <div className="size-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="size-3 text-white" />
                </div>
                <div className="text-xs text-green-800 dark:text-green-300 leading-relaxed">
                  <strong>100% Private:</strong> Your content is only visible
                  to people who have this exact link. Not indexed by search
                  engines.
                  {share.password_hash &&
                    ' Password required for extra security.'}
                </div>
              </div>
            </div>

            {/* Info badges */}
            <div className="flex flex-wrap items-center gap-2 py-4 border-y border-gray-100 dark:border-gray-800 mb-6">
              {share.expires_at && !expired && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Clock className="size-3.5" />
                  Expires {formatDateTime(share.expires_at)}
                </span>
              )}
              {!share.expires_at && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Clock className="size-3.5" />
                  Never expires
                </span>
              )}

              {isFileShare && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Download className="size-3.5" />
                  {share.download_limit === 0
                    ? 'Unlimited downloads'
                    : `${share.download_count}/${share.download_limit} downloads`}
                </span>
              )}

              {isTextShare && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <FileCode2 className="size-3.5" />
                  {share.content_type === 'code'
                    ? 'Code snippet'
                    : 'Text snippet'}
                </span>
              )}

              {share.password_hash && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Lock className="size-3.5" />
                  Password protected
                </span>
              )}
            </div>

            {/* ============ TEXT CONTENT ============ */}
            {isTextShare && share.content && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {share.content_type === 'code' ? 'Code' : 'Text'}
                  </h3>
                  <CopyButton
                    value={share.content}
                    label="Copy Text"
                    copiedLabel="Copied!"
                    variant="outline"
                    size="sm"
                  />
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-hidden">
                  <pre
                    className={cn(
                      'p-4 text-sm text-gray-900 dark:text-gray-100 overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-[70vh] overflow-y-auto',
                      share.content_type === 'code' && 'font-mono'
                    )}
                  >
                    {share.content}
                  </pre>
                </div>
              </div>
            )}

            {/* ============ SINGLE IMAGE ============ */}
            {singleImage && (
              <div className="space-y-3">
                <ImagePreview file={firstFile} />
                <Button
                  fullWidth
                  onClick={() => handleDownload(firstFile)}
                  disabled={downloadingId === firstFile.id}
                  leftIcon={
                    downloadingId === firstFile.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )
                  }
                >
                  {downloadingId === firstFile.id
                    ? 'Downloading...'
                    : 'Download Image'}
                </Button>
              </div>
            )}

            {/* ============ SINGLE PDF ============ */}
            {singlePdf && (
              <div className="space-y-3">
                <PdfPreview file={firstFile} />
                <Button
                  fullWidth
                  onClick={() => handleDownload(firstFile)}
                  disabled={downloadingId === firstFile.id}
                  leftIcon={
                    downloadingId === firstFile.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )
                  }
                >
                  {downloadingId === firstFile.id
                    ? 'Downloading...'
                    : 'Download PDF'}
                </Button>
              </div>
            )}

            {/* ============ SINGLE TEXT FILE ============ */}
            {singleText && (
              <div className="space-y-3">
                <TextFilePreview file={firstFile} />
                <Button
                  fullWidth
                  onClick={() => handleDownload(firstFile)}
                  disabled={downloadingId === firstFile.id}
                  leftIcon={
                    downloadingId === firstFile.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )
                  }
                >
                  {downloadingId === firstFile.id
                    ? 'Downloading...'
                    : 'Download File'}
                </Button>
              </div>
            )}

            {/* ============ MULTIPLE FILES or OTHER ============ */}
            {isFileShare && !singleImage && !singlePdf && !singleText && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {fileCount} {fileCount === 1 ? 'file' : 'files'}
                  </h3>
                  {fileCount > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        for (const f of share.files) {
                          await handleDownload(f)
                        }
                      }}
                      leftIcon={<Download className="size-3.5" />}
                    >
                      Download All
                    </Button>
                  )}
                </div>
                {share.files.map((file) => {
                  const downloaded = downloadedIds.has(file.id)
                  const isDownloading = downloadingId === file.id
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="size-10 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatBytes(file.size)}
                          {getFileExtension(file.name) && (
                            <span className="ml-1.5 uppercase">
                              • {getFileExtension(file.name)}
                            </span>
                          )}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={downloaded ? 'outline' : 'primary'}
                        onClick={() => handleDownload(file)}
                        disabled={isDownloading}
                        leftIcon={
                          isDownloading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : downloaded ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <Download className="size-3.5" />
                          )
                        }
                      >
                        {isDownloading
                          ? 'Downloading'
                          : downloaded
                            ? 'Downloaded'
                            : 'Download'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

// =====================================================
// Sub-components for direct previews
// =====================================================

function ImagePreview({ file }: { file: ShareWithFiles['files'][0] }) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let revoked = false
    let objectUrl: string | null = null

    async function load() {
      const { blob } = await downloadFile(file.storage_path)
      if (!blob || revoked) {
        setLoading(false)
        return
      }
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
      setLoading(false)
    }
    load()

    return () => {
      revoked = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file.storage_path])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
        <Loader2 className="size-6 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!url) return null

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <img
        src={url}
        alt={file.name}
        className="w-full max-h-[70vh] object-contain"
      />
    </div>
  )
}

function PdfPreview({ file }: { file: ShareWithFiles['files'][0] }) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let revoked = false
    let objectUrl: string | null = null

    async function load() {
      const { blob } = await downloadFile(file.storage_path)
      if (!blob || revoked) {
        setLoading(false)
        return
      }
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
      setLoading(false)
    }
    load()

    return () => {
      revoked = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file.storage_path])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
        <Loader2 className="size-6 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!url) return null

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <iframe src={url} title={file.name} className="w-full h-[70vh]" />
    </div>
  )
}

function TextFilePreview({ file }: { file: ShareWithFiles['files'][0] }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { blob } = await downloadFile(file.storage_path)
      if (!blob || cancelled) {
        setLoading(false)
        return
      }
      const text = await blob.text()
      if (!cancelled) {
        setContent(text)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [file.storage_path])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
        <Loader2 className="size-6 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end">
        <CopyButton
          value={content}
          label="Copy Text"
          copiedLabel="Copied!"
          variant="outline"
          size="sm"
        />
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <pre className="p-4 text-sm text-gray-900 dark:text-gray-100 overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-[70vh] overflow-y-auto font-mono">
          {content}
        </pre>
      </div>
    </div>
  )
}