import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { LoadingScreen } from '../components/ui/LoadingScreen'

export const AuthCallback = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  useEffect(() => {
    // Wait for the useAuth hook to process the session and fetch profile
    // useAuth runs in App.tsx and updates the store
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Show loading while auth state is being processed
  return <LoadingScreen />
}