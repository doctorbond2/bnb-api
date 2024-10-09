import { NextRequest, NextResponse } from 'next/server';
import { middleware_authenticate_request } from './utils/middleware/auth';
import ResponseError from './models/classes/responseError';

export async function middleware(req: NextRequest) {
  const [hasAuthErrors, authErrors, user] =
    await middleware_authenticate_request(req);
  if (hasAuthErrors) {
    return NextResponse.json(authErrors, { status: 401 });
  }
  const response = NextResponse.next();
  if (!user) {
    return ResponseError.default.unauthorized();
  }
  response.cookies.set('userId', user.id);
  if (user && user.admin) {
    response.cookies.set('admin', 'true');
  } else {
    response.cookies.set('admin', 'false');
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
  matcher: ['/api/users/:path*', '/api/admin/:path*', '/api/property/:path*'],
};
