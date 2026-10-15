export interface DatabaseShare {
  id: string
  slug: string | null
  password_hash: string | null
  expires_at: string | null
  download_limit: number
  download_count: number
  is_active: boolean
  user_id: string | null
  content: string | null
  content_type: 'file' | 'text' | 'code'
  created_at: string
  updated_at: string
}

export interface DatabaseFile {
  id: string
  share_id: string
  name: string
  size: number
  mime_type: string | null
  storage_path: string
  created_at: string
}

export interface ShareWithFiles extends DatabaseShare {
  files: DatabaseFile[]
}