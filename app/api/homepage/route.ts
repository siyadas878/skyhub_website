import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const DEFAULT_HOMEPAGE_SETTINGS = {
  id: 'f1000000-0000-0000-0000-000000000001',
  hero_badge: '• PRO BUSINESS LAPTOP • SPECIAL DUBAI OFFER',
  hero_title: 'Dell Latitude 5480 Core i5 Workstation',
  hero_subtitle: 'Supercharged for business & everyday tasks with Intel Core i5 6th Gen, 8GB DDR4 RAM, fast 256GB SSD, and 14-inch display. 35-Point Quality Verified in Dubai.',
  hero_primary_button_text: 'Shop Dell Latitude 5480',
  hero_primary_button_url: '/products/dell-latitude-5480-i5-6th-gen-8gb-256gb-ssd-used',
  hero_secondary_button_text: 'WhatsApp Inquiry',
  hero_rating_text: '4.9 ★ Rating',
  hero_rating_subtext: 'Over 2,500+ Verified Buyers in UAE',
  hero_image_url: '/products/dell-latitude-5480.jpg',

  best_picks_title: 'Best Picks For You',
  main_featured_product_id: 'a1000000-0000-0000-0000-000000000099',
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
  banner1_image_url: '/products/samsung-s24-ultra.png',

  promo_left_badge: 'Drone & Fast Power',
  promo_left_title: 'DJI Drones & High-Speed Chargers',
  promo_left_subtitle: 'Flagship DJI Mini 4 Pro 4K HDR drones and 200W high-speed power stations.',
  promo_left_button_text: 'Shop Accessories',
  promo_left_button_url: '/accessories',
  promo_left_image_url: '/products/dji-mini-4-pro.png',

  promo_right_badge: 'M3 Max Performance',
  promo_right_title: 'Apple MacBook Pro 16-inch',
  promo_right_subtitle: 'Extreme performance 36GB / 1TB workstation with Liquid Retina XDR display.',
  promo_right_button_text: 'Shop Workstations',
  promo_right_button_url: '/laptops',
  promo_right_image_url: '/products/macbook-pro-16.png',

  banner2_badge: 'Official Apple Showcase',
  banner2_title: 'Celebrate the Season with iPhone 15 Pro Max',
  banner2_subtitle: 'Grade A+ Pre-Owned & Sealed devices with 35-point testing guarantee and instant store pickup in Bur Dubai.',
  banner2_button_text: 'Shop iPhones',
  banner2_button_url: '/mobiles?brand=apple',
  banner2_image_url: '/products/iphone-15-pro-max.png',

  deals_title: 'Great Deals',
  deals_product_ids: [
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002'
  ],

  customer_reviews: [
    {
      id: 'rev-1',
      name: 'Mohammed Al-Hashemi',
      role: 'Verified Buyer • Deira, Dubai',
      rating: 5,
      avatar: '/avatars/customer-4.png',
      reviewTitle: 'Best Mobile Shop in Deira!',
      reviewText: 'Bought an iPhone 15 Pro Max from SKYHUB DUBAI. Device was 100% genuine sealed pack with official warranty. Fast WhatsApp response and friendly staff!',
      date: '2 days ago'
    },
    {
      id: 'rev-2',
      name: 'Sarah Jenkins',
      role: 'Content Creator • Downtown Dubai',
      rating: 5,
      avatar: '/avatars/customer-2.png',
      reviewTitle: 'Amazing Camera & Drone Gear',
      reviewText: 'Got the DJI Mini 4 Pro drone and wireless mics here. Honest pricing, great service, and they tested everything at their Fish Roundabout showroom.',
      date: '1 week ago'
    },
    {
      id: 'rev-3',
      name: 'Alexey Volkov',
      role: 'Software Engineer • Business Bay',
      rating: 5,
      avatar: '/avatars/customer-1.png',
      reviewTitle: 'Pristine MacBook Pro M3',
      reviewText: 'The MacBook Pro condition was beyond expectations! Zero scratches, 100% battery health, and saved over 1,500 AED compared to retail. Highly recommended!',
      date: '2 weeks ago'
    },
    {
      id: 'rev-4',
      name: 'Tariq Al-Maktoum',
      role: 'Business Owner • Jumeirah, Dubai',
      rating: 5,
      avatar: '/avatars/customer-3.png',
      reviewTitle: 'Quick & Honest Service',
      reviewText: 'Outstanding laptop repair & data recovery service. Restored all files from my corrupted SSD in less than 24 hours. Reliable team at SKYHUB.',
      date: '3 weeks ago'
    }
  ]
};

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

    // Fetch existing settings to ensure no fields are lost on update
    const { data: existingRow } = await supabase
      .from('store_settings')
      .select('address')
      .eq('id', 'f1000000-0000-0000-0000-000000000001')
      .maybeSingle();

    let existingConfig = {};
    if (existingRow && existingRow.address) {
      try {
        existingConfig = JSON.parse(existingRow.address);
      } catch {
        existingConfig = {};
      }
    }

    const mergedConfig = { ...DEFAULT_HOMEPAGE_SETTINGS, ...existingConfig, ...body };
    const configString = JSON.stringify(mergedConfig);

    const { error } = await supabase
      .from('store_settings')
      .upsert([{
        id: 'f1000000-0000-0000-0000-000000000001',
        store_name: '__HOMEPAGE_CONFIG__',
        phone: '+971 52 336 1092',
        whatsapp_number: '+971 52 336 1092',
        address: configString
      }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, homepageSettings: mergedConfig });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
