// import { NextRequest, NextResponse } from 'next/server';
// import cloudinary from 'cloudinary';

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req: NextRequest) {
//   const { image } = await req.json(); // Expect image data from the frontend

//   try {
//     const result = await cloudinary.v2.uploader.upload(image, {
//       folder: 'properties', // Specify the folder in Cloudinary
//     });

//     return NextResponse.json({ url: result.secure_url }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
//   }
// }
