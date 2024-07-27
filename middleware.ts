import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

// List of admin users
const adminEmails = ['mungaben21@gmail.com', 'BUMGARDNERSHN@outlook.com', 'AMA@outlook.com'];

export default async function middleware(req: NextRequest) {
  const protectedPaths = ['/dashboard', '/user', '/profile', '/api/protected', '/', '/dashboard'];
  const path = req.nextUrl.pathname;

  // Exclude the /api/Sms path from authentication
  if (path.startsWith('/api/Sms')) {
    return NextResponse.next();
  }

  // Check if the path is one of the protected paths
  if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    // Check for token in the request
    const token = await getToken({ req, secret });

    if (!token) {
      // If no token, redirect to the sign-in page
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check if the request method is DELETE and if the user is an admin
    if (req.method === 'DELETE' && !adminEmails.includes(token.email)) {
      // If not an admin, respond with a 403 Forbidden status
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Allow the request to proceed if authenticated or if the path is not protected
  return NextResponse.next();
}

// Define the configuration for the middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user/:path*',
    '/profile/:path*',
    '/api/protected/:path*',
    '/api/Users',
    '/',
    '/api'
  ],
};
