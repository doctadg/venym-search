import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
  '/api/dashboard(.*)',
  '/api/auth/me',
  '/api/auth/generate-key',
  '/api/api-keys(.*)',
  '/api/keys(.*)',
  '/api/user(.*)'
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/docs(.*)',
  '/pricing',
  '/products(.*)',
  '/login',
  '/signup',
  '/api/health',
  '/api/v1(.*)',
  '/api/webhooks(.*)',
  '/api/payments/create-subscription-checkout',
  '/api/payments/portal'
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
