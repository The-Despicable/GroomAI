import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

function getFirebaseApp() {
  if (typeof window === 'undefined') return null
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null
  if (getApps().length) return getApps()[0]
  return initializeApp(firebaseConfig)
}

const app = getFirebaseApp()

export const auth = app ? getAuth(app) : null
export const googleProvider = app ? new GoogleAuthProvider() : null

export async function signInWithGoogle() {
  if (!auth || !googleProvider) throw new Error('Firebase not configured')
  return signInWithPopup(auth, googleProvider)
}

export async function signOut() {
  if (!auth) return
  return firebaseSignOut(auth)
}