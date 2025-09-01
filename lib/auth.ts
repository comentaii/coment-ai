import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { userService } from "@/services/db";
import { companyService } from "@/services/db";
import { USER_ROLES } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { IUser } from "@/schemas";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
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
        
        let company = null;
        if (user.company) {
            const companyDetails = await companyService.findById(user.company.toString());
            if(companyDetails) {
                company = {
                    _id: companyDetails._id.toString(),
                    name: companyDetails.name,
                };
            }
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.role,
          company: company,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        
        const existingUser = await userService.findByEmail(user.email!);
        
        if (!existingUser) {
          const newUser = await userService.createUser({
            name: user.name!,
            email: user.email!,
            image: user.image!,
            role: USER_ROLES.CANDIDATE,
            emailVerified: new Date(),
          });
          
          user.id = newUser._id.toString();
          (user as IUser).role = newUser.role;
        } else {
          await userService.updateUser(existingUser._id.toString(), {
            image: user.image!,
            emailVerified: new Date(),
          });
          
          user.id = existingUser._id.toString();
          (user as IUser).role = existingUser.role;
          
          let company = null;
          if (existingUser.company) {
            const companyDetails = await companyService.findById(existingUser.company.toString());
            if(companyDetails) {
                company = {
                    _id: companyDetails._id.toString(),
                    name: companyDetails.name,
                };
            }
          }
          (user as IUser).company = company;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as IUser).role;
        token.company = (user as IUser).company;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.company = token.company;
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
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (in seconds)
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours (in seconds)
  },
  secret: process.env['NEXTAUTH_SECRET'],
};

export default authOptions;
