import { createClient } from './client';
import { Product, Category, Brand, StoreSettings, ProductInquiry } from '@/types';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as Category[];
  } catch {
    return [];
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true);

    if (error || !data) {
      return [];
    }
    return data as Brand[];
  } catch {
    return [];
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        images:product_images(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      ...item,
      images: item.images && item.images.length > 0 ? item.images : [
        { id: `img-${item.id}`, product_id: item.id, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', is_primary: true, sort_order: 1 }
      ]
    })) as Product[];
  } catch {
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as Product;
  } catch {
    return null;
  }
}

export async function fetchStoreSettings(): Promise<StoreSettings | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as StoreSettings;
  } catch {
    return null;
  }
}

export async function submitProductInquiry(inquiry: Omit<ProductInquiry, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (res.ok) {
      return { success: true };
    }
    const errData = await res.json();
    return { success: false, error: errData.error || 'Failed to submit inquiry' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
