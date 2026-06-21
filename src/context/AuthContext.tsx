'use client'
import { createContext, useContext } from 'react'
import { useUser } from '@clerk/nextjs'

interface AuthUser {
  id: string
  uid: string
  email: string | undefined
  displayName: string | null | undefined
  photoURL: string | null | undefined
}

const AuthContext = createContext<{ user: AuthUser | null; loading: boolean }>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser()

  const mapped = isSignedIn && user ? {
    id: user.id,
    uid: user.id,
    email: user.emailAddresses?.[0]?.emailAddress,
    displayName: user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0],
    photoURL: user.imageUrl,
  } : null

  return (
    <AuthContext.Provider value={{ user: mapped, loading: !isLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
