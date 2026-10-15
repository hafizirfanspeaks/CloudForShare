import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload as UploadIcon,
  Sparkles,
  AlertCircle,
  FileText,
  FileCode2,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import JsonLd from '@/components/seo/JsonLd'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import FileUploader from '@/components/file/FileUploader'
import FileList from '@/components/file/FileList'
import ShareSettings from '@/components/file/ShareSettings'
import TextEditor from '@/components/text/TextEditor'
import { useFileStore } from '@/store/fileStore'
import { getWebAppSchema } from '@/lib/seo/schema'
import { performUpload } from '@/services/uploadService'
import { cn } from '@/lib/utils/cn'

export default function Upload() {
  const navigate = useNavigate()
  const { files, mode, setMode, textContent, setShareResult } = useFileStore()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    mode === 'file' ? files.length > 0 : textContent.trim().length > 0

  const handleSubmit = async () => {
    if (!canSubmit || uploading) return

    setUploading(true)
    setError(null)

    const { result, error: uploadError } = await performUpload()

    if (uploadError || !result) {
      setError(uploadError || 'Upload failed')
      setUploading(false)
      return
    }

    setShareResult(result)
    setUploading(false)
    navigate(`/share/${result.id}`)
  }

  const buttonLabel =
    mode === 'file'
      ? `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'} & Get Link`
      : 'Create Share & Get Link'

  return (
    <>
      <SEO
        title="Share Text, Code or Files — Free & Instant"
        description="Paste text, share code, or upload files instantly. Password protection, expiry, and QR codes. No signup required."
        keywords={[
          'share text online',
          'share code online',
          'pastebin alternative',
          'upload files',
          'free file hosting',
        ]}
        url="/upload"
      />
      <JsonLd data={getWebAppSchema()} />

      <div className="container-custom py-10 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-4">
            <Sparkles className="size-3.5" />
            <span>Free • No signup required</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Share Text, Code or Files
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste text/code or upload files. Get a shareable link instantly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Mode Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium transition-all',
                mode === 'text'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <FileCode2 className="size-4" />
              Text / Code
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium transition-all',
                mode === 'file'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <FileText className="size-4" />
              Files
            </button>
          </div>

          {/* Content */}
          {mode === 'file' ? (
            <>
              <FileUploader disabled={uploading} />
              <FileList />
            </>
          ) : (
            <TextEditor />
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900">
              <AlertCircle className="size-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">{error}</div>
            </div>
          )}

          {/* Settings + Submit */}
          {canSubmit && (
            <>
              <Card padding="lg" className="border border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
                  Share settings
                </h3>
                <ShareSettings />
              </Card>

              <Button
                size="lg"
                fullWidth
                onClick={handleSubmit}
                loading={uploading}
                leftIcon={!uploading ? <UploadIcon className="size-5" /> : undefined}
              >
                {uploading ? 'Creating...' : buttonLabel}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}