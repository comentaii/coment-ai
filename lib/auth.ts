import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "@/services/db/user.service";
import { connectToDatabase } from "@/lib/db";
import { USER_ROLES, type UserRole } from "@/lib/constants/roles";

const userService = new UserService();

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
          role: user.role,
          companyId: user.companyId?.toString() || null,
        };

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
            role: USER_ROLES.CANDIDATE, // Default role for OAuth users
            emailVerified: new Date(),
          });
          
          user.id = newUser._id.toString();
          user.role = newUser.role;
          user.companyId = newUser.companyId?.toString() || null;
        } else {
          // Update existing user's Google info
          await userService.updateUser(existingUser._id.toString(), {
            image: user.image!,
            emailVerified: new Date(),
          });
          
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.companyId = existingUser.companyId?.toString() || null;
        }
      }
      
      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.userId = user.id;
        (token as any).role = (user as any).role;
        (token as any).companyId = (user as any).companyId;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = (token as any).role as UserRole;
        session.user.companyId = (token as any).companyId;
      }
      return session;
    },
    redirect: ({ url, baseUrl }) => {
      // If URL is already a full URL and on the same domain
      if (url.startsWith(baseUrl)) {
        // Extract locale from URL and redirect to dashboard
        const urlPath = url.replace(baseUrl, '');
        if (urlPath.startsWith('/en/') || urlPath.startsWith('/tr/')) {
          return url; // Keep as is if it already has locale
        }
        // If no locale, redirect to default locale dashboard
        return `${baseUrl}/tr/dashboard`;
      }
      // If relative URL
      if (url.startsWith('/')) {
        // Check for locale
        if (url.startsWith('/en/') || url.startsWith('/tr/')) {
          return `${baseUrl}${url}`;
        }
        // If no locale, add default locale
        return `${baseUrl}/tr${url}`;
      }
      return baseUrl;
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