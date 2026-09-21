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

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        images:product_images(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const formatted = (data || []).map((item: any) => ({
      ...item,
      images: item.images && item.images.length > 0 ? item.images : [
        { id: `img-${item.id}`, product_id: item.id, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', is_primary: true, sort_order: 1 }
      ]
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const productId = crypto.randomUUID();
    const baseSlug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const sku = body.sku || `SKU-${Date.now().toString().slice(-6)}`;

    const { image_urls, image_url, ...prodBody } = body;

    const productPayload = {
      id: productId,
      category_id: prodBody.category_id,
      brand_id: prodBody.brand_id,
      name: prodBody.name,
      slug,
      sku,
      description: prodBody.description || '',
      condition: prodBody.condition || 'Used',
      condition_grade: prodBody.condition_grade || 'Excellent',
      price: Number(prodBody.price),
      original_price: prodBody.original_price ? Number(prodBody.original_price) : null,
      stock_quantity: prodBody.stock_quantity ?? 1,
      is_available: prodBody.is_available !== false,
      featured: Boolean(prodBody.featured),
      is_active: prodBody.is_active !== false,
      specifications: prodBody.specifications || {}
    };

    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .insert([productPayload])
      .select()
      .single();

    if (prodErr) {
      return NextResponse.json({ error: prodErr.message }, { status: 400 });
    }

    const urls: string[] = Array.isArray(image_urls) && image_urls.length > 0
      ? image_urls
      : image_url
        ? [image_url]
        : [];

    if (urls.length > 0) {
      const imageRecords = urls.map((url: string, index: number) => ({
        product_id: productId,
        image_url: url,
        is_primary: index === 0,
        sort_order: index + 1
      }));
      await supabase.from('product_images').insert(imageRecords);
    }

    return NextResponse.json({ success: true, product: prodData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
