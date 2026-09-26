import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'skyhub';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files were uploaded' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Ensure bucket exists and is public
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const rawExt = file.name.split('.').pop() || 'jpg';
      const cleanExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '');
      const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (err: any) {
    console.error('Upload Route Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
