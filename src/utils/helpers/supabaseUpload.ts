// utils/uploadImage.ts

import supabase from '@/lib/supabaseClient';

/**
 * Upload multiple property images to Supabase storage
 * @param images Array of image files (Blob or File type) to be uploaded
 * @param folderName Folder where images will be stored
 * @returns Array of URLs for the uploaded images
 */
export async function uploadPropertyImages(
  images: File[],
  folderName = 'properties'
): Promise<string[]> {
  const imageUrls: string[] = [];
  console.log('images', images);
  try {
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileName = `${folderName}/${Date.now()}_${file.name}`; // Create a unique file name

      const { data, error } = await supabase.storage
        .from('bnb-property-images') // Replace with your Supabase storage bucket name
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false, // Do not overwrite existing files
        });

      if (error) {
        throw new Error(`Error uploading image ${file.name}: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('bnb-property-images')
        .getPublicUrl(data?.path as string);

      if (publicUrlData) {
        imageUrls.push(publicUrlData.publicUrl);
      }
    }
    return imageUrls;
  } catch (error) {
    console.error('Error uploading property images:', error);
    throw new Error('Failed to upload property images.');
  }
}

/**
 * Upload a profile image to Supabase storage
 * @param image Image file (Blob or File type) to be uploaded
 * @param folderName Folder where the image will be stored
 * @returns URL for the uploaded profile image
 */
export async function uploadProfileImage(
  image: File,
  folderName = 'profiles'
): Promise<string> {
  try {
    const fileName = `${folderName}/${Date.now()}_${image.name}`; // Create a unique file name

    const { data, error } = await supabase.storage
      .from('your-bucket-name') // Replace with your Supabase storage bucket name
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false, // Do not overwrite existing files
      });

    if (error) {
      throw new Error(`Error uploading profile image: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('your-bucket-name')
      .getPublicUrl(data?.path as string);

    if (publicUrlData) {
      return publicUrlData.publicUrl;
    }

    throw new Error('Failed to retrieve profile image URL.');
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Failed to upload profile image.');
  }
}
