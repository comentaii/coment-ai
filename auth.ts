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

            if (validatedFields.success) {
                const { email, password } = validatedFields.data;
                const user = await userService.findByEmail(email);
                if (!user) return null;
                const isPasswordMatch = await userService.comparePassword(password, user.password);
                if (isPasswordMatch) return user;
            }
            return null;
        }
    })
  ],
});
