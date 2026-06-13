import axios from 'axios'
import { supabase } from './supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

// Auto attach Supabase auth token
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.access_token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

export const papersApi = {
  getAll: () => api.get('/api/papers'),

  getOne: (id: string) => api.get(`/api/papers/${id}`),

  upload: (form: FormData) =>
    api.post('/api/papers/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  delete: (id: string) => api.delete(`/api/papers/${id}`),
}

export const chatApi = {
  send: (paperId: string, question: string) =>
    api.post('/api/chat', {
      paper_id: paperId,
      question,
    }),

  history: (paperId: string) =>
    api.get(`/api/chat/${paperId}/history`),
}

export default api