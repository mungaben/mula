// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      phone?: string;
      [key: string]: any;
    }
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    [key: string]: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    phone?: string;
  }
}
