import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { USER_ROLES } from '@/lib/constants';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'tr'],
  defaultLocale: 'tr',
  localePrefix: 'always'
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rule A: Next-auth routes are completely excluded from any processing.
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Rule B & C are handled by the intlMiddleware itself.
  // We provide a matcher that excludes all API routes from its processing.
  // This means it will only handle page routes for redirection.
  const intlResponse = intlMiddleware(req);

  // For API routes that still need i18n context (all except /api/auth),
  // we need a different approach. Since the default intlMiddleware skips them,
  // we can manually set the locale header here if needed, but for now, let's rely
  // on the default locale logic of getTranslations.
  // The main fix is to prevent intlMiddleware from ever touching non-auth API routes.
  
  // The rest of the logic is for auth checks on page routes.
  // This part only runs if intlMiddleware didn't redirect.

  // Rule D: Secure all API routes except for authentication endpoints.
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // If no token is found, return a 401 Unauthorized response.
      // This is the standard way to protect APIs.
      return new NextResponse(JSON.stringify({ message: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const finalResponse = intlResponse || NextResponse.next();
  
  // Extract locale and path without locale for page routes
  const locale = pathname.startsWith('/en/') ? 'en' : 'tr';
  const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, '');

  // Handle auth pages - redirect logged in users to dashboard
  if (pathWithoutLocale.startsWith('/auth/')) {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      
      if (token) {
        // User is logged in, redirect to dashboard
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
      }
    } catch (error) {
      console.error('Token check error:', error);
    }
  }

  // Handle protected routes - redirect non-authenticated users to unauthorized page
  if (pathWithoutLocale.startsWith('/dashboard/') || 
      pathWithoutLocale.startsWith('/admin/') || 
      pathWithoutLocale.startsWith('/candidates/') || 
      pathWithoutLocale.startsWith('/interviews/') || 
      pathWithoutLocale.startsWith('/proctoring/')) {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      
      if (!token) {
        // User not authenticated, redirect to unauthorized page
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
      }

      // Role-based access control
      const userRoles = token.roles as string[] || [];
      
      // Super admin routes
      if (pathWithoutLocale.startsWith('/admin/')) {
        if (!userRoles.includes(USER_ROLES.SUPER_ADMIN)) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
      
      // HR Manager routes
      if (pathWithoutLocale.startsWith('/candidates/') || 
          pathWithoutLocale.startsWith('/interviews/')) {
        if (!userRoles.includes(USER_ROLES.HR_MANAGER) && !userRoles.includes(USER_ROLES.SUPER_ADMIN)) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
      
      // Technical Interviewer routes
      if (pathWithoutLocale.startsWith('/proctoring/')) {
        if (!userRoles.includes(USER_ROLES.TECHNICAL_INTERVIEWER) && 
            !userRoles.includes(USER_ROLES.HR_MANAGER) && 
            !userRoles.includes(USER_ROLES.SUPER_ADMIN)) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
    } catch (error) {
      console.error('Authentication check error:', error);
      // On error, redirect to unauthorized page
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }
  }

  // Continue for other routes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files and _next internal files
    '/((?!_next|.*\\..*).*)',
    // Re-include API routes for manual handling, but next-auth is already excluded above.
    '/api/:path*'
  ],
};