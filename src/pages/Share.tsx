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
            <div className="size-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="size-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Share Not Available
            </h1>
            <p className="text-gray-600 mb-6">{errorMsg}</p>
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
            <Card padding="lg" className="border border-gray-200">
              <div className="text-center mb-6">
                <div className="size-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <Lock className="size-7 text-brand-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Password Protected
                </h1>
                <p className="text-sm text-gray-500">
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
                      className="text-gray-400 hover:text-gray-600"
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
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            Share your own content
          </Link>

          <Card padding="lg" className="border border-gray-200">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="size-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="size-7 text-brand-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {headerTitle}
              </h1>
              <p className="text-sm text-gray-500">{headerSubtitle}</p>
            </div>

            {/* Share link + QR (collapsible) */}
            <details className="mb-6">
              <summary className="cursor-pointer list-none text-xs font-medium text-gray-500 hover:text-gray-700 inline-flex items-center gap-1.5 select-none">
                <Lock className="size-3.5" />
                Show share link & QR code
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-center">
                <div>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 font-mono focus:outline-none focus:border-brand-500"
                  />
                  <div className="mt-3">
                    <CopyButton value={shareUrl} label="Copy Link" fullWidth />
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <QRCodeDisplay value={shareUrl} size={160} />
                </div>
              </div>
            </details>

            {/* Info badges */}
            <div className="flex flex-wrap items-center gap-2 py-4 border-y border-gray-100 mb-6">
              {share.expires_at && !expired && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-medium text-gray-600">
                  <Clock className="size-3.5" />
                  Expires {formatDateTime(share.expires_at)}
                </span>
              )}
              {!share.expires_at && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-medium text-gray-600">
                  <Clock className="size-3.5" />
                  Never expires
                </span>
              )}

              {isFileShare && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-medium text-gray-600">
                  <Download className="size-3.5" />
                  {share.download_limit === 0
                    ? 'Unlimited downloads'
                    : `${share.download_count}/${share.download_limit} downloads`}
                </span>
              )}

              {isTextShare && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-medium text-gray-600">
                  <FileCode2 className="size-3.5" />
                  {share.content_type === 'code' ? 'Code snippet' : 'Text snippet'}
                </span>
              )}

              {share.password_hash && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-medium text-gray-600">
                  <Lock className="size-3.5" />
                  Password protected
                </span>
              )}
            </div>

            {/* ============ TEXT CONTENT ============ */}
            {isTextShare && share.content && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
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
                <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                  <pre
                    className={cn(
                      'p-4 text-sm overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-[70vh] overflow-y-auto',
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
                  <h3 className="text-sm font-semibold text-gray-900">
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
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="size-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
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
      <div className="flex items-center justify-center py-20 bg-gray-50 rounded-xl border border-gray-200">
        <Loader2 className="size-6 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!url) return null

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
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
      <div className="flex items-center justify-center py-20 bg-gray-50 rounded-xl border border-gray-200">
        <Loader2 className="size-6 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!url) return null

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
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
      <div className="flex items-center justify-center py-20 bg-gray-50 rounded-xl border border-gray-200">
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
      <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
        <pre className="p-4 text-sm overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-[70vh] overflow-y-auto font-mono">
          {content}
        </pre>
      </div>
    </div>
  )
}