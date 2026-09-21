import { createClient } from './client';

export const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'akyhub';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://syyuzrayxpezrybwqmcj.supabase.co';

/**
 * Returns the public direct URL for an image stored in the Supabase bucket 'akyhub'
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
