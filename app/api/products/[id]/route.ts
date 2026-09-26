import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { deleteStorageFilesByUrls } from '@/lib/supabase/storage';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const supabase = getAdminClient();

    const { image_urls, image_url, images, category, brand, ...productUpdates } = body;

    const { data, error } = await supabase
      .from('products')
      .update(productUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const urls: string[] | null = Array.isArray(image_urls) && image_urls.length > 0
      ? image_urls
      : image_url
        ? [image_url]
        : null;

    if (urls) {
      // Find old image URLs that are being replaced or removed
      const { data: oldImgs } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', id);

      if (oldImgs && oldImgs.length > 0) {
        const removedUrls = oldImgs
          .map((i) => i.image_url)
          .filter((oldUrl) => !urls.includes(oldUrl));

        if (removedUrls.length > 0) {
          await deleteStorageFilesByUrls(removedUrls, supabase);
        }
      }

      await supabase.from('product_images').delete().eq('product_id', id);
      const imgPayload = urls.map((url: string, index: number) => ({
        product_id: id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index + 1
      }));
      await supabase.from('product_images').insert(imgPayload);
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = getAdminClient();

    // Fetch associated product images to clean up files from Supabase Storage
    const { data: existingImgs } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', id);

    if (existingImgs && existingImgs.length > 0) {
      const urlsToDelete = existingImgs.map((img) => img.image_url).filter(Boolean);
      await deleteStorageFilesByUrls(urlsToDelete, supabase);
    }

    // Delete product images DB records first
    await supabase.from('product_images').delete().eq('product_id', id);

    // Delete product DB record
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
