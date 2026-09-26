import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { deleteStorageFilesByUrls } from '@/lib/supabase/storage';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const supabase = getAdminClient();

    // If image_url is being updated, check if old image should be cleaned up from Storage
    if (body.image_url) {
      const { data: oldCat } = await supabase
        .from('categories')
        .select('image_url')
        .eq('id', id)
        .maybeSingle();

      if (oldCat?.image_url && oldCat.image_url !== body.image_url) {
        await deleteStorageFilesByUrls(oldCat.image_url, supabase);
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, category: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = getAdminClient();

    const { data: oldCat } = await supabase
      .from('categories')
      .select('image_url')
      .eq('id', id)
      .maybeSingle();

    if (oldCat?.image_url) {
      await deleteStorageFilesByUrls(oldCat.image_url, supabase);
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
