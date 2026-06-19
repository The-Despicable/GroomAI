import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

function hasFirebaseConfig(): boolean {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId)
}

const app = hasFirebaseConfig() ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) : null
export const auth = app ? getAuth(app) : null
export const googleProvider = app ? new GoogleAuthProvider() : null

export async function signInWithGoogle() {
  if (!auth || !googleProvider) return null
  return signInWithPopup(auth, googleProvider)
}

export async function signOut() {
  if (!auth) return
  return firebaseSignOut(auth)
}