import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

console.log(
  'CLOUDINARY_CLOUD_NAME:',
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
);
console.log('CLOUDINARY_API_KEY:', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
console.log(
  'CLOUDINARY_API_SECRET:',
  process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
);

export default cloudinary;
