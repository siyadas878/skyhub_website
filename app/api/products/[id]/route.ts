import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxryqeomeomssenymqdp.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

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

    // Delete product images first
    await supabase.from('product_images').delete().eq('product_id', id);

    // Delete product
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
