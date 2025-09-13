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
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error('NEXTAUTH_SECRET is not set. Authentication will not work.');
    return new NextResponse(JSON.stringify({ message: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { pathname } = req.nextUrl;

  // Check if the path is an API route, ignoring any potential locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, '');

  if (pathWithoutLocale.startsWith('/api/')) {
    // This is an API route. It should not be processed for i18n redirects.
    // 1. Handle public auth endpoints
    if (pathWithoutLocale.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // 2. Secure all other API endpoints
    const token = await getToken({ req, secret });
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. If the original path had a locale, rewrite it to remove the locale prefix
    // so Next.js can find the correct API route file in `app/api/...`.
    if (pathname !== pathWithoutLocale) {
      return NextResponse.rewrite(new URL(pathWithoutLocale, req.url));
    }

    // If no locale was present (e.g., a direct call to /api/...), just continue.
    return NextResponse.next();
  }

  // If it's not an API route, it's a page. Let next-intl handle it first.
  const intlResponse = intlMiddleware(req);

  // Then, apply page-level authentication and authorization.
  // Note: pathWithoutLocale is already calculated above.

  // Handle auth pages - redirect logged in users to dashboard
  if (pathWithoutLocale.startsWith('/auth/')) {
    try {
      const token = await getToken({ req, secret });
      
      if (token) {
        // User is logged in, redirect to dashboard
        const locale = pathname.startsWith('/en/') ? 'en' : 'tr';
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
      }
    } catch (error) {
      console.error('Token check error:', error);
    }
  }

  // Handle protected routes
  const protectedRoutes = [
    '/dashboard', 
    '/admin', 
    '/super-admin',
    '/candidates', 
    '/interviews', 
    '/proctoring'
  ];

  if (protectedRoutes.some(route => pathWithoutLocale.startsWith(route))) {
    try {
      const token = await getToken({ req, secret });
      const locale = pathname.startsWith('/en/') ? 'en' : 'tr';
      
      if (!token) {
        // User not authenticated, redirect to the sign-in page
        const signInUrl = new URL(`/${locale}/auth/signin`, req.url);
        // Add a callbackUrl so the user is redirected back to the page they
        // were trying to access after they successfully log in.
        signInUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(signInUrl);
      }

      // Role-based access control
      const userRoles = token.roles as string[] || [];
      
      // Super admin routes
      if (pathWithoutLocale.startsWith('/admin') || pathWithoutLocale.startsWith('/super-admin')) {
        if (!userRoles.includes(USER_ROLES.SUPER_ADMIN)) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
      
      // HR Manager routes
      if (pathWithoutLocale.startsWith('/candidates') || 
          pathWithoutLocale.startsWith('/interviews')) {
        if (!userRoles.includes(USER_ROLES.HR_MANAGER) && !userRoles.includes(USER_ROLES.SUPER_ADMIN)) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
      
      // Technical Interviewer routes
      if (pathWithoutLocale.startsWith('/proctoring')) {
        if (!userRoles.includes(USER_ROLES.TECHNICAL_INTERVIEWER) && 
            !userRoles.includes(USER_ROLES.HR_MANAGER) && 
            !userRoles.includes(USER_ROLES.SUPER_ADMIN)) {
          // Forbidden access, redirect to forbidden page
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }
      }
    } catch (error) {
      const locale = pathname.startsWith('/en/') ? 'en' : 'tr';
      // On error, redirect to sign-in page as a fallback
      const signInUrl = new URL(`/${locale}/auth/signin`, req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // For all other page routes, return the response from the intl middleware.
  return intlResponse;
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