import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/(.*)/inzeraty/novy',
  '/api/inzeraty',       // ✅ Opraveno z /api/items na /api/inzeraty
  '/api/inzeraty/(.*)',  // ✅ Opraveno
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  if (!request.nextUrl.pathname.startsWith('/api')) {
    return intlMiddleware(request);
  }
});

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
    "/api/(.*)",
  ],
};
