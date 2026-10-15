import { create } from 'zustand'
import type {
  UploadedFile,
  ShareResult,
  ShareSettings,
  ShareMode,
  TextLanguage,
} from '@/types/file'

interface FileStore {
  // Mode
  mode: ShareMode
  setMode: (mode: ShareMode) => void

  // Files
  files: UploadedFile[]
  addFiles: (newFiles: File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  updateFile: (id: string, updates: Partial<UploadedFile>) => void

  // Text
  textContent: string
  setTextContent: (content: string) => void
  textLanguage: TextLanguage
  setTextLanguage: (lang: TextLanguage) => void

  // Settings
  settings: ShareSettings
  updateSettings: (updates: Partial<ShareSettings>) => void
  resetSettings: () => void

  // Result
  shareResult: ShareResult | null
  setShareResult: (result: ShareResult | null) => void

  // Reset
  reset: () => void
}

const defaultSettings: ShareSettings = {
  expiresInHours: 24,
  password: '',
  downloadLimit: 0,
  customSlug: '',
}

let fileIdCounter = 0

export const useFileStore = create<FileStore>((set) => ({
  mode: 'text',
  setMode: (mode) => set({ mode }),

  files: [],

  addFiles: (newFiles) =>
    set((state) => {
      const mapped: UploadedFile[] = newFiles.map((file) => ({
        id: `f_${Date.now()}_${fileIdCounter++}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'pending',
        previewUrl: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined,
      }))
      return { files: [...state.files, ...mapped] }
    }),

  removeFile: (id) =>
    set((state) => {
      const file = state.files.find((f) => f.id === id)
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl)
      return { files: state.files.filter((f) => f.id !== id) }
    }),

  clearFiles: () =>
    set((state) => {
      state.files.forEach(
        (f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)
      )
      return { files: [] }
    }),

  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  textContent: '',
  setTextContent: (textContent) => set({ textContent }),
  textLanguage: 'plain',
  setTextLanguage: (textLanguage) => set({ textLanguage }),

  settings: defaultSettings,
  updateSettings: (updates) =>
    set((state) => ({ settings: { ...state.settings, ...updates } })),
  resetSettings: () => set({ settings: defaultSettings }),

  shareResult: null,
  setShareResult: (result) => set({ shareResult: result }),

  reset: () =>
    set((state) => {
      state.files.forEach(
        (f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)
      )
      return {
        mode: 'text',
        files: [],
        textContent: '',
        textLanguage: 'plain',
        settings: defaultSettings,
        shareResult: null,
      }
    }),
}))