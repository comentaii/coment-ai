import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';

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

  // Handle protected routes - redirect non-authenticated users to signin
  if (pathWithoutLocale.startsWith('/dashboard/') || 
      pathWithoutLocale.startsWith('/admin/') || 
      pathWithoutLocale.startsWith('/candidates/') || 
      pathWithoutLocale.startsWith('/interviews/') || 
      pathWithoutLocale.startsWith('/proctoring/')) {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      
      if (!token) {
        // User not authenticated, redirect to signin
        return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url));
      }

      // Basic role check (can be enhanced later)
      const userRole = token.role as string;
      if (pathWithoutLocale.startsWith('/admin/') && userRole !== 'super_admin') {
        // Unauthorized access, redirect to dashboard
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
      }
    } catch (error) {
      console.error('Authentication check error:', error);
      // On error, redirect to signin
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url));
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