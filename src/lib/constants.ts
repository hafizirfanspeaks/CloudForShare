// =====================================================
// APP INFO
// =====================================================
export const APP_NAME = 'CloudForShare'
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://cloudforshare.com'
export const APP_TAGLINE = 'Share Files, Text & Code Instantly'
export const APP_DESCRIPTION =
  'Share files, text, and code instantly with a live link. No signup required. Fast, secure, and free.'
export const APP_VERSION = '1.0.0'

// =====================================================
// COMPANY INFO (Irfanz Solutions)
// =====================================================
export const COMPANY_NAME = 'Irfanz Solutions'
export const COMPANY_SHORT_NAME = 'Irfanz'
export const COMPANY_EMAIL = 'irfanzsolutions@gmail.com'
export const COMPANY_WEBSITE = 'https://irfanzsolutions.com' // Update when live
export const COMPANY_TAGLINE = 'Building modern software that scales.'
export const COMPANY_DESCRIPTION =
  'Irfanz Solutions is a software development company specializing in modern web apps, mobile apps, SaaS platforms, and custom software solutions.'
export const COMPANY_FOUNDER = 'Irfan'
export const COMPANY_LOCATION = 'Pakistan'
export const COMPANY_FOUNDED_YEAR = 2024
export const COMPANY_RESPONSE_TIME = '24 hours'

// Company Services
export const COMPANY_SERVICES = [
  'Web Application Development',
  'Mobile App Development',
  'SaaS Platform Development',
  'Custom Software Solutions',
  'UI/UX Design',
  'API Development & Integration',
  'Database Design & Optimization',
  'Cloud Deployment & DevOps',
] as const

// Company Socials
export const COMPANY_SOCIALS = {
  email: `mailto:${COMPANY_EMAIL}`,
  github: 'https://github.com/irfanzsolutions',
  twitter: 'https://twitter.com/irfanzsolutions',
  linkedin: 'https://linkedin.com/company/irfanzsolutions',
  whatsapp: 'https://wa.me/923000000000', // ⚠️ Update with real number
  instagram: 'https://instagram.com/irfanzsolutions',
} as const

// =====================================================
// FILE LIMITS
// =====================================================
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB (Supabase free tier limit)
export const MAX_FILES_PER_UPLOAD = 10
export const ALLOWED_FILE_TYPES = '*' // all types
export const STORAGE_BUCKET = 'uploads'

// Upload rate limit (Tier 3)
export const MAX_UPLOADS_PER_HOUR = 20
export const MAX_API_CALLS_PER_MINUTE = 100

// =====================================================
// EXPIRY OPTIONS (in hours)
// =====================================================
export const EXPIRY_OPTIONS = [
  { label: '1 Hour', value: 1 },
  { label: '24 Hours', value: 24 },
  { label: '7 Days', value: 24 * 7 },
  { label: '30 Days', value: 24 * 30 },
  { label: 'Never', value: 0 },
] as const

// =====================================================
// DOWNLOAD LIMIT OPTIONS
// =====================================================
export const DOWNLOAD_LIMIT_OPTIONS = [
  { label: 'Unlimited', value: 0 },
  { label: '1 Download', value: 1 },
  { label: '5 Downloads', value: 5 },
  { label: '10 Downloads', value: 10 },
  { label: '100 Downloads', value: 100 },
] as const

// =====================================================
// ROUTES
// =====================================================
export const ROUTES = {
  HOME: '/',
  NEW: '/new',
  BOARD: '/b/:slug',
  UPLOAD: '/upload',
  SHARE: '/share/:id',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const

// =====================================================
// SEO / META DEFAULTS
// =====================================================
export const SEO_DEFAULTS = {
  titleTemplate: '%s | CloudForShare',
  defaultTitle: 'CloudForShare — Share Files, Text & Code Instantly',
  description: APP_DESCRIPTION,
  keywords: [
    'file sharing',
    'share files online',
    'free file upload',
    'pastebin alternative',
    'share code online',
    'live board',
    'no signup file share',
    'send large files',
    'temporary file hosting',
    'cloudforshare',
    'irfanz solutions',
  ],
  ogImage: `${APP_URL}/og-image.png`,
  twitterHandle: '@cloudforshare',
} as const

// =====================================================
// THEME
// =====================================================
export const THEME_STORAGE_KEY = 'cloudforshare-theme'
export const THEME_USER_SET_KEY = 'cloudforshare-theme-user-set'
export const ONBOARDING_DONE_KEY = 'cloudforshare-onboarding-done'
export const RATE_LIMIT_KEY = 'cloudforshare-ratelimit'

// Auto theme hours (dark mode by time)
export const DARK_MODE_START_HOUR = 19 // 7 PM
export const DARK_MODE_END_HOUR = 6 // 6 AM

// =====================================================
// KEYBOARD SHORTCUTS
// =====================================================
export const SHORTCUTS = {
  SEARCH: 'Ctrl+K',
  QR: 'Ctrl+Q',
  SETTINGS: 'Ctrl+Shift+E',
  ZIP: 'Ctrl+Shift+D',
  PASTE: 'Ctrl+V',
  CANCEL: 'Escape',
} as const