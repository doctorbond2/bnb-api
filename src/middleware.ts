import { NextRequest, NextResponse } from 'next/server';
import { middleware_authenticate_request } from './utils/middleware/auth';

export async function middleware(req: NextRequest) {
  const [hasAuthErrors, authErrors, userId] =
    await middleware_authenticate_request(req);
  if (hasAuthErrors) {
    return NextResponse.json(authErrors, { status: 401 });
  }
  const response = NextResponse.next();
  if (userId) {
    response.cookies.set('userId', userId);
  }

  // if (req.nextUrl.pathname.startsWith('/api/admin')) {
  //   const [hasAdminErrors, adminErrors] = await middleware_admin_request(req);
  //   if (hasAdminErrors) {
  //     return NextResponse.json(adminErrors);
  //   }
  // }

  return response;
}

export const config = {
  matcher: ['/api/users/:path*', '/api/admin/:path*'],
};
