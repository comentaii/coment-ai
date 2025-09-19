import type { NextAuthConfig } from 'next-auth';
import { authOptions } from '@/lib/auth';
 
export const authConfig = {
  pages: {
    signIn: '/tr/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/tr/dashboard') || nextUrl.pathname.startsWith('/en/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Production'da doğru URL ile yönlendirme
        const isProduction = process.env.NODE_ENV === 'production';
        const baseUrl = isProduction ? process.env.NEXTAUTH_URL : nextUrl.origin;
        const redirectUrl = isProduction ? `${baseUrl}/tr/dashboard` : '/tr/dashboard';
        return Response.redirect(new URL(redirectUrl, nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

export { authOptions };
