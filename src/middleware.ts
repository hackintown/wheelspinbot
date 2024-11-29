import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware checks in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const tgData = request.headers.get('telegram-data');
  
  if (!tgData && !request.url.includes('/api/webhook')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/wheel-spin/:path*', '/api/:path*'],
}; 