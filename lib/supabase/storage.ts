import { createClient } from './client';

export const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'skyhub';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Returns the public direct URL for an image stored in the Supabase bucket 'skyhub'
 */
export function getPublicStorageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
}

/**
 * Uploads an image file to the Supabase storage bucket 'akyhub'
 */
export async function uploadImageToStorage(file: File, folderPath: string = 'products'): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${folderPath}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    console.error('Upload exception:', err);
    return { url: null, error: err.message || 'Failed to upload image' };
  }
}

/**
 * Extracts relative storage path from a Supabase storage URL or path.
 * Example: "https://...supabase.co/storage/v1/object/public/skyhub/products/image.png" -> "products/image.png"
 */
export function extractStoragePath(url: string): string | null {
  if (!url) return null;

  const bucketMarker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  if (url.includes(bucketMarker)) {
    return url.split(bucketMarker)[1] || null;
  }

  // Also check if path starts with folder like products/ or categories/
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  if (cleanPath.startsWith('products/') || cleanPath.startsWith('categories/') || cleanPath.startsWith('avatars/')) {
    return cleanPath;
  }

  return null;
}

/**
 * Deletes files from Supabase Storage by their public URLs or relative storage paths
 */
export async function deleteStorageFilesByUrls(urls: string | string[], supabaseClient?: any): Promise<boolean> {
  try {
    const urlList = Array.isArray(urls) ? urls : [urls];
    const pathsToDelete = urlList
      .map((u) => extractStoragePath(u))
      .filter((p): p is string => Boolean(p));

    if (pathsToDelete.length === 0) return true;

    const client = supabaseClient || createClient();
    const { error } = await client.storage.from(BUCKET_NAME).remove(pathsToDelete);

    if (error) {
      console.error('Error deleting files from Supabase storage:', error.message);
      return false;
    }
    console.log('Successfully deleted files from Supabase storage:', pathsToDelete);
    return true;
  } catch (err: any) {
    console.error('Exception deleting files from Supabase storage:', err);
    return false;
  }
}
