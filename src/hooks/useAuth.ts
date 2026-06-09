import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Check if user already has active session
    // Runs once when app loads
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        // Fetch their profile from our profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.warn('Profile fetch error:', error)
          // If profile doesn't exist, create a basic one from auth user
          const newProfile = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
          }
          setUser(newProfile)
        } else {
          setUser(profile)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    getSession()

    // Listen for login/logout events
    // Fires whenever auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        if (event === 'SIGNED_IN' && session?.user) {
          // Small wait to ensure profile trigger has run
          await new Promise(resolve => setTimeout(resolve, 500))

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error) {
            console.warn('Profile fetch error on sign in:', error)
            // If profile doesn't exist, create a basic one from auth user
            const newProfile = {
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || null,
              avatar_url: session.user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
            }
            setUser(newProfile)
          } else {
            setUser(profile)
          }
          setLoading(false)
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    // Cleanup when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      console.error('Google sign in error:', error.message)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }
}