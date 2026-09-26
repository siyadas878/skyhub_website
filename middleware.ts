import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('skyhub_admin_token')?.value;
    const isLoginPage = pathname === '/admin/login';

    // If user is not authenticated and trying to access any admin screen other than login -> Redirect to login
    if (!adminToken && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If user IS authenticated and tries to visit login page -> Redirect to dashboard
    if (adminToken && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If navigating directly to /admin -> Redirect to /admin/dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
