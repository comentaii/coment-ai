import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { userService } from "@/services/db";
import { connectToDatabase } from "@/lib/db";
import { USER_ROLES, type UserRole } from "@/lib/constants/roles";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectToDatabase();

        const user = await userService.findByEmailWithPassword(credentials.email);

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await userService.verifyPassword(user, credentials.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        const userForAuth = {
          id: user._id?.toString() || "",
          name: user.name,
          email: user.email,
          image: user.image || null,
          roles: Array.isArray((user as any).roles) && (user as any).roles.length > 0
            ? (user as any).roles
            : (user as any).role
              ? [(user as any).role]
              : [USER_ROLES.CANDIDATE],
          companyId: user.companyId?.toString() || null,
        } as any;

        return userForAuth;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        
        // Check if user exists
        const existingUser = await userService.findByEmail(user.email!);
        
        if (!existingUser) {
          // Create new user with Google OAuth
          const newUser = await userService.createUser({
            name: user.name!,
            email: user.email!,
            image: user.image!,
            roles: [USER_ROLES.CANDIDATE], // Default role for OAuth users
            emailVerified: new Date(),
          });
          
          user.id = newUser._id.toString();
          (user as any).roles = (newUser as any).roles;
          user.companyId = newUser.companyId?.toString() || null;
        } else {
          // Update existing user's Google info
          await userService.updateUser(existingUser._id.toString(), {
            image: user.image!,
            emailVerified: new Date(),
          });
          
          user.id = existingUser._id.toString();
          (user as any).roles = (existingUser as any).roles ?? (existingUser as any).role ? [(existingUser as any).role] : [USER_ROLES.CANDIDATE];
          user.companyId = existingUser.companyId?.toString() || null;
        }
      }
      
      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.userId = user.id;
        (token as any).roles = (user as any).roles ?? ((user as any).role ? [(user as any).role] : [USER_ROLES.CANDIDATE]);
        (token as any).companyId = (user as any).companyId;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id;
        // @ts-ignore - extend session with roles array
        session.user.roles = (token as any).roles as UserRole[];
        session.user.companyId = (token as any).companyId;
      }
      return session;
    },
    redirect: ({ url, baseUrl }) => {
      // Production'da baseUrl kontrolü
      const isProduction = process.env.NODE_ENV === 'production';
      const productionUrl = process.env.NEXTAUTH_URL || baseUrl;
      const actualBaseUrl = isProduction ? productionUrl : baseUrl;
      
      // If URL is already a full URL and on the same domain
      if (url.startsWith(actualBaseUrl)) {
        const urlPath = url.replace(actualBaseUrl, '');
        // If the URL already has a locale and is not a sign-in page, keep it
        if ((urlPath.startsWith('/en/') || urlPath.startsWith('/tr/')) && !urlPath.includes('/auth/')) {
          return url;
        }
        // Only redirect to dashboard for sign-in pages or pages without locale
        if (urlPath.includes('/auth/') || (!urlPath.startsWith('/en/') && !urlPath.startsWith('/tr/'))) {
          return `${actualBaseUrl}/tr/dashboard`;
        }
        return url;
      }
      // If relative URL
      if (url.startsWith('/')) {
        // Don't redirect if it's already a valid route with locale
        if ((url.startsWith('/en/') || url.startsWith('/tr/')) && !url.includes('/auth/')) {
          return `${actualBaseUrl}${url}`;
        }
        // Only redirect to dashboard for auth pages or pages without locale
        if (url.includes('/auth/') || (!url.startsWith('/en/') && !url.startsWith('/tr/'))) {
          return `${actualBaseUrl}/tr/dashboard`;
        }
        return `${actualBaseUrl}${url}`;
      }
      return `${actualBaseUrl}/tr/dashboard`;
    },
  },
  pages: {
    signIn: "/tr/auth/signin",
    signOut: "/tr/auth/signout",
    error: "/tr/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (in seconds)
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours (in seconds)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;