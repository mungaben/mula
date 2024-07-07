// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AdapterUser } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone Number', type: 'text' },
      },
      authorize: async (credentials): Promise<AdapterUser | null> => {
        if (!credentials) return null;

        const { email, password } = credentials;

        // Validate email and password types
        if (typeof email !== 'string' || typeof password !== 'string') {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Check if user exists and password matches
        if (user && await bcrypt.compare(password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone ?? undefined,
            emailVerified: user.emailVerified ?? null,
          };
        }

        // Return null if authentication fails
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id,
          email: token.email!,
          name: token.name,
          phone: token.phone,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/register',
  },
};

// This handler allows NextAuth to handle both GET and POST requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
