import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxryqeomeomssenymqdp.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DEFAULT_HOMEPAGE_SETTINGS = {
  id: 'f1000000-0000-0000-0000-000000000001',
  hero_badge: '• FLAGSHIP TECHNOLOGY • DUBAI',
  hero_title: 'Redefining Everyday Tech',
  hero_subtitle: "Experience Dubai's top rated collection of brand new & pre-owned iPhones, MacBooks, Samsung Galaxy Ultra, and pro accessories with guaranteed battery health.",
  hero_primary_button_text: 'Shop Now',
  hero_primary_button_url: '/mobiles',
  hero_secondary_button_text: 'WhatsApp Inquiry',
  hero_rating_text: '4.9 ★ Rating',
  hero_rating_subtext: 'Over 2,500+ Verified Buyers in UAE',
  hero_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/iphone-15-pro-max.png',

  best_picks_title: 'Best Picks For You',
  main_featured_product_id: 'a1000000-0000-0000-0000-000000000001',
  secondary_featured_product_ids: [
    'a1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000008'
  ],

  banner1_badge: 'Next-Gen Foldable & Ultra',
  banner1_title: 'Samsung Galaxy S24 Ultra & Fold Series',
  banner1_subtitle: 'Powered by Galaxy AI, 200MP camera technology, built-in S-Pen, and 12GB RAM for ultimate productivity.',
  banner1_button_text: 'Explore Samsung Line-up',
  banner1_button_url: '/mobiles?brand=samsung',
  banner1_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/samsung-s24-ultra.png',

  promo_left_badge: 'Drone & Fast Power',
  promo_left_title: 'DJI Drones & High-Speed Chargers',
  promo_left_subtitle: 'Flagship DJI Mini 4 Pro 4K HDR drones and 200W high-speed power stations.',
  promo_left_button_text: 'Shop Accessories',
  promo_left_button_url: '/accessories',
  promo_left_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/dji-mini-4-pro.png',

  promo_right_badge: 'M3 Max Performance',
  promo_right_title: 'Apple MacBook Pro 16-inch',
  promo_right_subtitle: 'Extreme performance 36GB / 1TB workstation with Liquid Retina XDR display.',
  promo_right_button_text: 'Shop Workstations',
  promo_right_button_url: '/laptops',
  promo_right_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/macbook-pro-16.png',

  banner2_badge: 'Official Apple Showcase',
  banner2_title: 'Celebrate the Season with iPhone 15 Pro Max',
  banner2_subtitle: 'Grade A+ Pre-Owned & Sealed devices with 35-point testing guarantee and instant store pickup in Bur Dubai.',
  banner2_button_text: 'Shop iPhones',
  banner2_button_url: '/mobiles?brand=apple',
  banner2_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/iphone-15-pro-max.png',

  deals_title: 'Great Deals',
  deals_product_ids: [
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002'
  ]
};

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
      .from('store_settings')
      .select('address')
      .eq('id', 'f1000000-0000-0000-0000-000000000001')
      .maybeSingle();

    if (!error && data?.address) {
      try {
        const parsed = JSON.parse(data.address);
        return NextResponse.json({ ...DEFAULT_HOMEPAGE_SETTINGS, ...parsed });
      } catch (e) {
        // Fallback
      }
    }

    return NextResponse.json(DEFAULT_HOMEPAGE_SETTINGS);
  } catch (err: any) {
    return NextResponse.json(DEFAULT_HOMEPAGE_SETTINGS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const configString = JSON.stringify(body);

    const { data, error } = await supabase
      .from('store_settings')
      .upsert([{
        id: 'f1000000-0000-0000-0000-000000000001',
        store_name: '__HOMEPAGE_CONFIG__',
        phone: '+971 4 339 3234',
        whatsapp_number: '+971 50 123 4567',
        address: configString
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, homepageSettings: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
