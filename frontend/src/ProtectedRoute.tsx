
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './auth'
import type { Role } from './types'
export default function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: Role }){
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}
