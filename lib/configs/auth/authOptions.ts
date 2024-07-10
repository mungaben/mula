// lib/configs/auth/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone Number', type: 'text' },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const { email, password } = credentials;

        if (typeof email !== 'string' || typeof password !== 'string') {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone ?? undefined,
            emailVerified: user.emailVerified ?? null,
          };
        }

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

export default authOptions;
