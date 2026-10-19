import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from './ui'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Spinner />
  }
  if (!user) {
    return <Navigate to="/signin" replace />
  }
  return <Outlet />
}

export function AdminRoute() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <Spinner />
  }
  if (!user) {
    return <Navigate to="/signin" replace />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
