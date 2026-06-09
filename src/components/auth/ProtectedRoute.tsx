import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { LoadingScreen } from '../ui/LoadingScreen'

type Props = {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuthStore()

  // Still checking auth status
  if (loading) return <LoadingScreen />

  // Not logged in → go to login page
  if (!user) return <Navigate to="/login" replace />

  // Logged in → show the page
  return <>{children}</>
}