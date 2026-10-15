import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, loading, initialized } = useAuthStore()

  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
  }
}