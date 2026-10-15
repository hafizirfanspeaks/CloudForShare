import { toast } from 'sonner'

interface LoadingOptions {
  id?: string | number
  description?: string
}

export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, { description })
  },

  error: (message: string, description?: string) => {
    toast.error(message, { description })
  },

  info: (message: string, description?: string) => {
    toast.info(message, { description })
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, { description })
  },

  /**
   * Loading toast — returns ID for later update/dismiss.
   * Pass `options.id` to update an existing toast.
   */
  loading: (
    message: string,
    options?: LoadingOptions
  ): string | number => {
    return toast.loading(message, {
      id: options?.id,
      description: options?.description,
    })
  },

  /**
   * Dismiss a toast by ID (or all if no ID provided).
   */
  dismiss: (id?: string | number) => {
    toast.dismiss(id)
  },

  /**
   * Promise-based toast — auto-updates on success/error.
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return toast.promise(promise, messages)
  },

  /**
   * Custom toast message.
   */
  custom: (message: string, description?: string) => {
    toast(message, { description })
  },
}