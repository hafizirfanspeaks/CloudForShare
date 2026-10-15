export interface Board {
  id: string
  slug: string
  text_content: string
  user_id: string | null
  password_hash: string | null
  expires_at: string | null
  is_custom_slug: boolean
  created_at: string
  updated_at: string
}

export interface BoardFile {
  id: string
  board_id: string
  name: string
  size: number
  mime_type: string | null
  storage_path: string
  created_at: string
}

export interface BoardWithFiles extends Board {
  board_files: BoardFile[]
}