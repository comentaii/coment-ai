import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/lib/validation-schemas';
import userService from '@/services/db/user.service';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const validatedFields = loginSchema.safeParse(credentials);

            if (!validatedFields.success) return null;

            const { email, password } = validatedFields.data;
            const user = await userService.findByEmailWithPassword(email);
            if (!user) return null;

            const isPasswordMatch = await userService.verifyPassword(user, password);
            if (!isPasswordMatch) return null;

            // Strip password before returning
            // @ts-ignore
            if (user.password) user.password = undefined as any;
            return user as any;
        }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.id = (user.id || user._id?.toString?.()) as string;
        // @ts-ignore
        const roles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : ['candidate']);
        // Temporary debug logs
        // eslint-disable-next-line no-console
        console.log('[Auth][JWT] user.roles:', (user as any)?.roles, 'user.role:', (user as any)?.role, 'computed roles:', roles);
        // @ts-ignore
        token.roles = roles;
        // @ts-ignore
        token.company = user.company ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.id = token.id as string;
      // @ts-ignore
      session.user.roles = (token.roles as string[]) ?? ['candidate'];
      // Temporary debug logs
      // eslint-disable-next-line no-console
      console.log('[Auth][SESSION] token.roles:', (token as any)?.roles, 'session.user.roles:', (session as any)?.user?.roles);
      // @ts-ignore
      session.user.company = token.company ?? null;
      return session;
    },
  },
});
