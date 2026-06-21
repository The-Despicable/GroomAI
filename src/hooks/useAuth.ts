'use client'

import { useState, useEffect } from 'react'
import { auth, signInWithGoogle, signOut as firebaseSignOut } from '../lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'

export function useAuth() {
  const noAuth = !auth
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(noAuth ? false : true)

  useEffect(() => {
    if (noAuth) return
    const unsub = onAuthStateChanged(auth!, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [noAuth])

  const signIn = async () => {
    try {
      await signInWithGoogle()
    } catch {
      // user cancelled or error
    }
  }

  const signOutUser = async () => {
    await firebaseSignOut()
  }

  return { user, loading, signIn, signOut: signOutUser }
}