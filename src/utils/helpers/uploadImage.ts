import cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);
async function uploadPropertyImages(imageUrls: string[]): Promise<string[]> {
  try {
    const uploadResults = await Promise.all(
      imageUrls.map((url) =>
        cloudinary.v2.uploader.upload(url, {
          folder: 'properties',
        })
      )
    );
    const secureUrls = uploadResults.map((result) => result.secure_url);
    return secureUrls;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(String(error));
  }
}
async function uploadProfileImage(imageUrl: string): Promise<string> {
  try {
    const result = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: 'profile',
    });
    return result.secure_url;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(String(error));
  }
}
export { uploadPropertyImages, uploadProfileImage };
