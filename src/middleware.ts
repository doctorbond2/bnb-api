import { NextRequest, NextResponse } from 'next/server';
import { middleware_authenticate_request } from './utils/middleware/auth';
import ResponseError from './models/classes/responseError';

export async function middleware(req: NextRequest) {
  const allowedOrigins = ['http://localhost:8080'];
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  const allowedHeaders = ['Authorization', 'Content-Type', 'X-Api-Key'];

  const origin = req.headers.get('origin');

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'CORS Not Allowed' }, { status: 403 });
  }

  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', origin || '');
    response.headers.set(
      'Access-Control-Allow-Methods',
      allowedMethods.join(',')
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      allowedHeaders.join(',')
    );
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
  const [hasAuthErrors, authErrors, user] =
    await middleware_authenticate_request(req);
  if (hasAuthErrors) {
    return NextResponse.json(authErrors, { status: 401 });
  }

  const response = NextResponse.next();
  if (!user) {
    return ResponseError.custom.unauthorized('User not found');
  }

  response.headers.set('x-admin' as string, user.admin ? 'true' : 'false');
  response.headers.set('x-user-id' as string, user.id);
  response.headers.set('Access-Control-Allow-Origin', origin || '');
  response.headers.set(
    'Access-Control-Allow-Methods',
    allowedMethods.join(',')
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    allowedHeaders.join(',')
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  // if (req.nextUrl.pathname.startsWith('/api/admin')) {
  //   const [hasAdminErrors, adminErrors] = await middleware_admin_request(req);
  //   if (hasAdminErrors) {
  //     return NextResponse.json(adminErrors);
  //   }
  // }

  return response;
}

export const config = {
  matcher: ['/api/users/:path*', '/api/admin/:path*', '/api/protected/:path*'],
};
