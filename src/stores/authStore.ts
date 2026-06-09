import { create } from 'zustand'
import { type Profile } from '../lib/supabase'

type AuthStore = {
  user: Profile | null
  loading: boolean
  setUser: (user: Profile | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))