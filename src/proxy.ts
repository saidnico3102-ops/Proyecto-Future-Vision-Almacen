import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = getSessionFromToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );

  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin/inventario', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*'],
};
