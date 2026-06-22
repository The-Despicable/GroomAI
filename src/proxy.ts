import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/help(.*)',
  '/terms(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sign-out(.*)',
  '/explore(.*)',
  '/bookings(.*)',
  '/dashboard(.*)',
  '/profile(.*)',
  '/assistant(.*)',
  '/admin(.*)',
  '/salon(.*)',
  '/checkout(.*)',
  '/api(.*)',
])

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  },
  { signInUrl: '/sign-in', signUpUrl: '/sign-up' }
)

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
}
