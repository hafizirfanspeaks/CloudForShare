const STORAGE_KEY = 'cloudforshare-ratelimit'

interface RateLimitRecord {
  uploads: number[]
  apiCalls: number[]
}

/**
 * Simple client-side rate limiter using localStorage.
 * Server-side protection is in Supabase RLS.
 */

function load(): RateLimitRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { uploads: [], apiCalls: [] }
    return JSON.parse(raw)
  } catch {
    return { uploads: [], apiCalls: [] }
  }
}

function save(record: RateLimitRecord) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // storage full — ignore
  }
}

function pruneOld(arr: number[], windowMs: number): number[] {
  const cutoff = Date.now() - windowMs
  return arr.filter((t) => t > cutoff)
}

/**
 * Check if user can upload (max 20 files/hour).
 */
export function canUpload(): { allowed: boolean; remaining: number } {
  const record = load()
  const windowMs = 60 * 60 * 1000 // 1 hour
  record.uploads = pruneOld(record.uploads, windowMs)

  const max = 20
  const remaining = Math.max(0, max - record.uploads.length)
  save(record)

  return { allowed: remaining > 0, remaining }
}

/**
 * Record an upload.
 */
export function recordUpload() {
  const record = load()
  record.uploads.push(Date.now())
  save(record)
}

/**
 * Check API rate limit (100 calls/min).
 */
export function canMakeApiCall(): { allowed: boolean; remaining: number } {
  const record = load()
  const windowMs = 60 * 1000 // 1 min
  record.apiCalls = pruneOld(record.apiCalls, windowMs)

  const max = 100
  const remaining = Math.max(0, max - record.apiCalls.length)
  save(record)

  return { allowed: remaining > 0, remaining }
}

/**
 * Record an API call.
 */
export function recordApiCall() {
  const record = load()
  record.apiCalls.push(Date.now())
  save(record)
}