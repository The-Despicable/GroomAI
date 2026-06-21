export function signInWithGoogle() {
  if (typeof window !== 'undefined') {
    try {
      const clerk = (window as any).Clerk
      if (clerk?.openSignIn) {
        clerk.openSignIn()
        return
      }
    } catch {}
    window.location.href = '/sign-in'
  }
}

export function signOut() {
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-out'
  }
}
