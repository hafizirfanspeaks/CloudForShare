import { supabase } from './client'

// =====================================================
// Sign Up
// =====================================================
export async function signUp(
  email: string,
  password: string
): Promise<{
  success: boolean
  error: string | null
  needsVerification: boolean
}> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
        needsVerification: false,
      }
    }

    const needsVerification = !data.session
    return { success: true, error: null, needsVerification }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Signup failed',
      needsVerification: false,
    }
  }
}

// =====================================================
// Sign In
// =====================================================
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Login failed',
    }
  }
}

// =====================================================
// Sign in with Google OAuth
// =====================================================
export async function signInWithGoogle(): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Google sign in failed',
    }
  }
}

// =====================================================
// Sign Out
// =====================================================
export async function signOut(): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Logout failed',
    }
  }
}

// =====================================================
// Get current user
// =====================================================
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}