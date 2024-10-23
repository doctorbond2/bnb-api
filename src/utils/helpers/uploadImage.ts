// import cloudinary from '@/lib/cloudinaryConfig';

// async function uploadPropertyImages(imageFiles: File[]): Promise<string[]> {
//   try {
//     const uploadResults = await Promise.all(
//       imageFiles.map(async (file) => {
//         return cloudinary.v2.uploader
//           .upload(file, {
//             folder: 'properties',
//           })
//           .then((result) => result.secure_url)
//           .catch((error) => {
//             throw new Error(`Error uploading image: ${error.message}`);
//           });
//       })
//     );
//     return uploadResults;
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
