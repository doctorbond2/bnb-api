// import { NextRequest, NextResponse } from 'next/server';
// import { middleware_authenticate_request } from './utils/middleware/auth';
// import ResponseError from './models/classes/responseError';
// import path from 'path';

///MIDDLEWARE///vv

// import { NextRequest, NextResponse } from 'next/server';
// import { middleware_authenticate_request } from './utils/middleware/auth';
// import ResponseError from './models/classes/responseError';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   console.log('PATHNAME: ', pathname);
//   const [hasErrors, errors] = await middleware_authenticate_request(req);
//   if (hasErrors) {
//     return NextResponse.json(errors);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/api/users/:path*', '/api/admin/:path*'],
// };

///MIDDLEWARE///^^

//   const decodedUser = verifyRefreshToken(refreshToken);
//     if (!decodedUser) {
//       return ResponseError.custom.unauthorized('Invalid refresh token');
//     }

//     const token: string = await generateToken(decodedUser as User_JWT);

//     const newRefreshToken: string = await generateRefreshToken(
//       decodedUser as User_JWT
//     );

////////

// export const verifyToken = async (req: NextRequest) => {
//     const token = req.headers.get('Authorization')?.split(' ')[1];
//     console.log('TOKEN: ', token);
//     if (!token) {
//       return null;
//     }
//     try {
//       const decoded = jwt.verify(token, SECRET_KEY as string);
//       if (typeof decoded === 'string') {
//         return null;
//       }
//       return decoded.id;
//     } catch (err) {
//       console.log(err);
//       return null;
//     }
//   };

//   export const verifyRefreshToken = (token: string) => {
//     try {
//       const decoded = jwt.verify(token, REFRESH_SECRET_KEY as string);
//       if (typeof decoded === 'string') {
//         return null;
//       }
//       return decoded;
//     } catch (err) {
//       console.log(err);
//       return null;
//     }
//   };
