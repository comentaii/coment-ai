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

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Handle internationalization first
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }

  // Extract locale and path without locale
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
      const userRole = token.role as string;
      
      // Super admin routes
      if (pathWithoutLocale.startsWith('/admin/')) {
        if (userRole !== USER_ROLES.SUPER_ADMIN) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
      
      // HR Manager routes
      if (pathWithoutLocale.startsWith('/candidates/') || 
          pathWithoutLocale.startsWith('/interviews/')) {
        if (![USER_ROLES.HR_MANAGER, USER_ROLES.SUPER_ADMIN].includes(userRole)) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
      
      // Technical Interviewer routes
      if (pathWithoutLocale.startsWith('/proctoring/')) {
        if (![USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.HR_MANAGER, USER_ROLES.SUPER_ADMIN].includes(userRole)) {
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
    // Root path
    '/',
    // Auth pages
    '/en/auth/:path*',
    '/tr/auth/:path*',
    // Protected routes
    '/en/admin/:path*',
    '/tr/admin/:path*',
    '/en/dashboard/:path*',
    '/tr/dashboard/:path*',
    '/en/candidates/:path*',
    '/tr/candidates/:path*',
    '/en/interviews/:path*',
    '/tr/interviews/:path*',
    '/en/proctoring/:path*',
    '/tr/proctoring/:path*',
    // Other paths (excluding static files)
    '/((?!_next|.*\\..*).*)'
  ],
};