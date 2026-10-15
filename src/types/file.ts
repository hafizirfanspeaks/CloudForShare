export type ShareMode = 'file' | 'text'

export type TextLanguage =
  | 'plain'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'sql'
  | 'bash'
  | 'markdown'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  previewUrl?: string
}

export interface ShareSettings {
  expiresInHours: number
  password: string
  downloadLimit: number
  customSlug: string
}

export interface ShareResult {
  id: string
  shareUrl: string
  qrCode: string
  expiresAt: string | null
  downloadLimit: number
  hasPassword: boolean
  contentType: 'file' | 'text' | 'code'
  files: {
    name: string
    size: number
    type: string
    url: string
  }[]
}