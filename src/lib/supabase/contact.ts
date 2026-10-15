import { supabase } from './client'

export interface ContactMessage {
  id: string
  name: string
  email: string | null
  phone: string | null
  service: string | null
  budget: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  source: string
  created_at: string
}

export interface SubmitContactParams {
  name: string
  email?: string
  phone?: string
  service?: string
  budget?: string
  message: string
}

/**
 * Submit a contact form message to Supabase.
 */
export async function submitContactMessage(
  params: SubmitContactParams
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { name, email, phone, service, budget, message } = params

    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      service: service?.trim() || null,
      budget: budget?.trim() || null,
      message: message.trim(),
      user_agent: navigator.userAgent.slice(0, 200),
    })

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to submit',
    }
  }
}

/**
 * Get all contact messages (admin only).
 */
export async function getContactMessages(): Promise<{
  messages: ContactMessage[]
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { messages: [], error: error.message }
    return { messages: (data || []) as ContactMessage[], error: null }
  } catch (err) {
    return {
      messages: [],
      error: err instanceof Error ? err.message : 'Failed to load',
    }
  }
}