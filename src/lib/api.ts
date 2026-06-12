// meridian-web/src/lib/api.ts
// Add papers endpoints

import axios from 'axios'
import { supabase } from './supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

// Auto attach token
api.interceptors.request.use(async (config) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

export const papersApi = {
  getAll: () => api.get('/api/papers'),

  getOne: (id: string) =>
    api.get(`/api/papers/${id}`),

  upload: (form: FormData) =>
    api.post('/api/papers/upload', form),

  delete: (id: string) =>
    api.delete(`/api/papers/${id}`)
}

export default api