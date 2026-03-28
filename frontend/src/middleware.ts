import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Public paths that don't need auth
  const isPublicPath = path === '/' || path === '/login' || path === '/signup';

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      // Decode JWT to check role
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'serveconnect-super-secret-jwt-key-256-bits-long-1234567890abcdef'
      );
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // If on public path but logged in, redirect to dashboard
      // Skip this redirect for client-side navigations (e.g. after logout clears cookie race)
      const isClientNav = request.headers.get('next-router-prefetch') || request.headers.get('rsc');
      if (isPublicPath && !isClientNav) {
        if (role === 'SERVICE_PROVIDER') return NextResponse.redirect(new URL('/provider/dashboard', request.url));
        if (role === 'SERVICE_AVAILER') return NextResponse.redirect(new URL('/availer/dashboard', request.url));
        if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      // Check role-based route access
      if (path.startsWith('/provider') && role !== 'SERVICE_PROVIDER') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (path.startsWith('/availer') && role !== 'SERVICE_AVAILER') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (path.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      // Token invalid or expired
      if (!isPublicPath) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        response.cookies.delete('user');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
