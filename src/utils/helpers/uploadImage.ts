// import cloudinary from '@/lib/cloudinaryConfig';

// async function uploadPropertyImages(imageUrls: string[]): Promise<string[]> {
//   try {
//     const uploadResults = await Promise.all(
//       imageUrls.map((url) =>
//         cloudinary.v2.uploader.upload(url, {
//           folder: 'properties',
//         })
//       )
//     );
//     const secureUrls = uploadResults.map((result) => result.secure_url);
//     return secureUrls;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }
//     throw new Error(String(error));
//   }
// }
// async function uploadProfileImage(imageUrl: string): Promise<string> {
//   try {
//     const result = await cloudinary.v2.uploader.upload(imageUrl, {
//       folder: 'profile',
//     });
//     return result.secure_url;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }
//     throw new Error(String(error));
//   }
// }
// export { uploadPropertyImages, uploadProfileImage };
