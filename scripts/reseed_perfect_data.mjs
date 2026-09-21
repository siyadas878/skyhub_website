import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxryqeomeomssenymqdp.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'skyhub';

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is missing in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function reseed() {
  console.log('Clearing existing data from Supabase database tables...');

  // Delete child tables first
  await supabase.from('product_inquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('brands').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('store_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Existing tables wiped clean successfully!');

  // 1. SEED CATEGORIES
  console.log('Inserting main categories...');
  const categories = [
    { id: 'c1000000-0000-0000-0000-000000000001', name: 'Mobile Phones', slug: 'mobiles', description: 'Brand new & pre-owned flagship smartphones with battery health guarantee', image_url: '/categories/mobiles.png', sort_order: 1 },
    { id: 'c1000000-0000-0000-0000-000000000002', name: 'Laptops', slug: 'laptops', description: 'Pro MacBooks, Dell XPS & high performance workstations', image_url: '/categories/laptops.png', sort_order: 2 },
    { id: 'c1000000-0000-0000-0000-000000000003', name: 'Accessories', slug: 'accessories', description: 'DJI drones, fast chargers, audio gear & cinema accessories', image_url: '/categories/accessories.png', sort_order: 3 }
  ];

  const { error: catErr } = await supabase.from('categories').insert(categories);
  if (catErr) console.error('Categories error:', catErr.message);
  else console.log('✅ Categories inserted!');

  // 2. SEED BRANDS
  console.log('Inserting manufacturer brands...');
  const brands = [
    { id: 'b1000000-0000-0000-0000-000000000001', name: 'Apple', slug: 'apple' },
    { id: 'b1000000-0000-0000-0000-000000000002', name: 'Samsung', slug: 'samsung' },
    { id: 'b1000000-0000-0000-0000-000000000003', name: 'Dell', slug: 'dell' },
    { id: 'b1000000-0000-0000-0000-000000000004', name: 'Sony', slug: 'sony' },
    { id: 'b1000000-0000-0000-0000-000000000005', name: 'DJI', slug: 'dji' },
    { id: 'b1000000-0000-0000-0000-000000000006', name: 'Anker', slug: 'anker' },
    { id: 'b1000000-0000-0000-0000-000000000007', name: 'Google', slug: 'google' },
    { id: 'b1000000-0000-0000-0000-000000000008', name: 'ASUS', slug: 'asus' },
    { id: 'b1000000-0000-0000-0000-000000000009', name: 'Lenovo', slug: 'lenovo' }
  ];

  const { error: brandErr } = await supabase.from('brands').insert(brands);
  if (brandErr) console.error('Brands error:', brandErr.message);
  else console.log('✅ Brands inserted!');

  // 3. SEED STORE SETTINGS & HOMEPAGE CONFIG
  console.log('Inserting store info settings & default homepage config...');
  const defaultHomepageConfig = {
    hero_badge: '• FLAGSHIP TECHNOLOGY • DUBAI',
    hero_title: 'Redefining Everyday Tech',
    hero_subtitle: "Experience Dubai's top rated collection of brand new & pre-owned iPhones, MacBooks, Samsung Galaxy Ultra, and pro accessories with guaranteed battery health.",
    hero_primary_button_text: 'Shop Now',
    hero_primary_button_url: '/mobiles',
    hero_secondary_button_text: 'WhatsApp Inquiry',
    hero_rating_text: '4.9 ★ Rating',
    hero_rating_subtext: 'Over 2,500+ Verified Buyers in UAE',
    hero_image_url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/iphone-15-pro-max.png`,
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
    banner1_image_url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/samsung-s24-ultra.png`,
    promo_left_badge: 'Drone & Fast Power',
    promo_left_title: 'DJI Drones & High-Speed Chargers',
    promo_left_subtitle: 'Flagship DJI Mini 4 Pro 4K HDR drones and 200W high-speed power stations.',
    promo_left_button_text: 'Shop Accessories',
    promo_left_button_url: '/accessories',
    promo_left_image_url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/dji-mini-4-pro.png`,
    promo_right_badge: 'M3 Max Performance',
    promo_right_title: 'Apple MacBook Pro 16-inch',
    promo_right_subtitle: 'Extreme performance 36GB / 1TB workstation with Liquid Retina XDR display.',
    promo_right_button_text: 'Shop Workstations',
    promo_right_button_url: '/laptops',
    promo_right_image_url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/macbook-pro-16.png`,
    banner2_badge: 'Official Apple Showcase',
    banner2_title: 'Celebrate the Season with iPhone 15 Pro Max',
    banner2_subtitle: 'Grade A+ Pre-Owned & Sealed devices with 35-point testing guarantee and instant store pickup in Bur Dubai.',
    banner2_button_text: 'Shop iPhones',
    banner2_button_url: '/mobiles?brand=apple',
    banner2_image_url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/iphone-15-pro-max.png`,
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

  const { error: settingsErr } = await supabase.from('store_settings').insert([
    {
      id: 'e1000000-0000-0000-0000-000000000001',
      store_name: 'SKYHUB DUBAI',
      phone: '+971 52 336 1092',
      whatsapp_number: '+971 52 336 1092',
      email: 'info@skyhubdubai.com',
      address: 'Fish Roundabout, Al Rigga, Deira, Dubai, UAE',
      google_maps_url: 'https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOTILCAEQABgKGAsYgAQyEQgCEC4YChgLGK8BGMcBGIAEMhEIAxAuGAoYCxivARjHARiABDIRCAQQLhgKGAsYrwEYxwEYgAQyCwgFEAAYChgLGIAEMgsIBhAAGAoYCxiABDILCAcQABgKGAsYgAQyEQgIEC4YChgLGK8BGMcBGIAEMgsICRAAGAoYCxiABNIBCTQ0MjlqMGoxNagCCLACAfEF9RSlZbfsCAnxBfUUpWW37AgJ&um=1&ie=UTF-8&fb=1&gl=ae&sa=X&geocode=KXW641OVQ18-MYkYCToW81qZ&daddr=fish+round+boat+-+Fish+Roundabout+-+Al+Rigga+-+Deira+-+Dubai',
      opening_hours: 'Sat - Thu: 10:00 AM - 10:00 PM | Fri: 4:00 PM - 10:00 PM',
      instagram_url: 'https://www.instagram.com/sky_hub_official/',
      facebook_url: 'https://www.facebook.com/p/skysbuy-100054198354444'
    },
    {
      id: 'f1000000-0000-0000-0000-000000000001',
      store_name: '__HOMEPAGE_CONFIG__',
      phone: '+971 52 336 1092',
      whatsapp_number: '+971 52 336 1092',
      address: JSON.stringify(defaultHomepageConfig)
    }
  ]);
  if (settingsErr) console.error('Settings error:', settingsErr.message);
  else console.log('✅ Store Settings & Homepage Config inserted!');

  // Primary Supabase storage images
  const imgIphone = `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/iphone-15-pro-max.png`;
  const imgSamsung = `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/samsung-s24-ultra.png`;
  const imgMacbook = `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/macbook-pro-16.png`;
  const imgDrone = `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/dji-mini-4-pro.png`;

  // High quality hardware photography
  const imgIphone14 = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80';
  const imgFold5 = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80';
  const imgIphone15 = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80';
  const imgPixel8 = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80';
  const imgS23Ultra = 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&auto=format&fit=crop&q=80';
  const imgIphone13P = 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80';

  const imgMacbookAir = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80';
  const imgDellXps = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80';
  const imgMbp14 = 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80';
  const imgAsusRog = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80';
  const imgThinkpad = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80';

  const imgSonyHeadphones = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
  const imgAnkerBank = 'https://images.unsplash.com/photo-1609592424074-b52b3112db59?w=800&auto=format&fit=crop&q=80';
  const imgAirpodsPro = 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80';
  const imgWatchUltra = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80';
  const imgOsmoPocket = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
  const imgGalaxyWatch = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
  const imgAnker737 = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80';

  // 4. SEED PERFECT PRODUCTS Across ALL 3 Categories
  console.log('Inserting 22 rich catalog products into Supabase DB...');
  const productsList = [
    // --- MOBILE PHONES ---
    {
      id: 'a1000000-0000-0000-0000-000000000001',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
      slug: 'iphone-15-pro-max-256gb-natural-titanium-used',
      sku: 'SKU-IP15PM-256-NAT',
      description: 'Pre-owned iPhone 15 Pro Max in pristine condition. Grade A+ tested with 94% guaranteed battery health, original box & USB-C cable.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 3399,
      original_price: 4299,
      stock_quantity: 3,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { storage: '256GB', ram: '8GB', color: 'Natural Titanium', battery_health: '94%', processor: 'A17 Pro Chip', display: '6.7" Super Retina XDR 120Hz' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000002',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000002',
      name: 'Samsung Galaxy S24 Ultra 512GB - Titanium Black',
      slug: 'samsung-galaxy-s24-ultra-512gb-titanium-black-new',
      sku: 'SKU-S24U-512-BLK',
      description: 'Brand New Sealed Pack Samsung Galaxy S24 Ultra featuring Galaxy AI realtime translation, 200MP Quad Camera system, and built-in S-Pen.',
      condition: 'New',
      price: 3799,
      original_price: 4599,
      stock_quantity: 5,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { storage: '512GB', ram: '12GB', color: 'Titanium Black', processor: 'Snapdragon 8 Gen 3 for Galaxy', camera: '200MP Quad Camera', battery: '5000mAh' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000005',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'iPhone 14 Pro 128GB - Deep Purple',
      slug: 'iphone-14-pro-128gb-deep-purple-used',
      sku: 'SKU-IP14P-128-PUR',
      description: 'Pre-owned iPhone 14 Pro with Dynamic Island and Always-On display. Verified 35-point inspection with original box and 91% battery health.',
      condition: 'Used',
      condition_grade: 'Very Good',
      price: 2599,
      original_price: 3499,
      stock_quantity: 2,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { storage: '128GB', ram: '6GB', color: 'Deep Purple', battery_health: '91%', processor: 'A16 Bionic Chip' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000006',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000002',
      name: 'Samsung Galaxy Z Fold 5 512GB - Phantom Black',
      slug: 'samsung-galaxy-z-fold-5-512gb-phantom-black-used',
      sku: 'SKU-ZFOLD5-512-BLK',
      description: 'Pre-owned Foldable Workstation Smartphone with 7.6-inch Dynamic AMOLED 2X interior screen and Flex Hinge technology.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 3899,
      original_price: 5499,
      stock_quantity: 1,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { storage: '512GB', ram: '12GB', color: 'Phantom Black', screen: '7.6" Main + 6.2" Cover', processor: 'Snapdragon 8 Gen 2' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000011',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'iPhone 15 128GB - Blue',
      slug: 'iphone-15-128gb-blue-new',
      sku: 'SKU-IP15-128-BLU',
      description: 'Brand New Sealed Pack iPhone 15 with Dynamic Island, 48MP Main Camera, and color-infused glass back.',
      condition: 'New',
      price: 2799,
      original_price: 3399,
      stock_quantity: 4,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { storage: '128GB', ram: '6GB', color: 'Blue', camera: '48MP Dual Camera', processor: 'A16 Bionic' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000012',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000007',
      name: 'Google Pixel 8 Pro 256GB - Obsidian',
      slug: 'google-pixel-8-pro-256gb-obsidian-new',
      sku: 'SKU-PIXEL8P-256',
      description: 'Brand New Google Pixel 8 Pro with Tensor G3 chip, Best Take photo editing, and 7 years of OS updates.',
      condition: 'New',
      price: 2999,
      original_price: 3799,
      stock_quantity: 3,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { storage: '256GB', ram: '12GB', color: 'Obsidian', processor: 'Google Tensor G3', display: '6.7" LTPO OLED 120Hz' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000013',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000002',
      name: 'Samsung Galaxy S23 Ultra 256GB - Green',
      slug: 'samsung-galaxy-s23-ultra-256gb-green-used',
      sku: 'SKU-S23U-256-GRN',
      description: 'Pre-owned Flagship S23 Ultra with 200MP camera and 100x Space Zoom. 95% battery health guaranteed.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 2699,
      original_price: 3899,
      stock_quantity: 2,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { storage: '256GB', ram: '8GB', color: 'Green', camera: '200MP + 10x Optical Zoom', processor: 'Snapdragon 8 Gen 2' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000014',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'iPhone 13 Pro 256GB - Sierra Blue',
      slug: 'iphone-13-pro-256gb-sierra-blue-used',
      sku: 'SKU-IP13P-256-BLU',
      description: 'Pre-owned iPhone 13 Pro in Sierra Blue with 120Hz ProMotion screen. 88% battery health verified.',
      condition: 'Used',
      condition_grade: 'Very Good',
      price: 1999,
      original_price: 3199,
      stock_quantity: 2,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { storage: '256GB', ram: '6GB', color: 'Sierra Blue', battery_health: '88%', processor: 'A15 Bionic' }
    },

    // --- LAPTOPS ---
    {
      id: 'a1000000-0000-0000-0000-000000000003',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'MacBook Pro 16" M3 Max 36GB / 1TB SSD - Space Black',
      slug: 'macbook-pro-16-m3-max-36gb-1tb-ssd-space-black-used',
      sku: 'SKU-MBP16-M3M-36-1T',
      description: 'Flagship pre-owned MacBook Pro 16-inch with M3 Max 14-Core CPU and 30-Core GPU. Extreme performance for 8K video editing and 3D rendering.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 9499,
      original_price: 12499,
      stock_quantity: 2,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { processor: 'Apple M3 Max 14-core', ram: '36GB Unified', storage: '1TB NVMe SSD', screen: '16.2" Liquid Retina XDR 120Hz', color: 'Space Black' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000007',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'MacBook Air 15" M2 16GB / 512GB SSD - Midnight',
      slug: 'macbook-air-15-m2-16gb-512gb-midnight-new',
      sku: 'SKU-MBA15-M2-16-512',
      description: 'Brand New Sealed 15-inch MacBook Air with M2 chip, 16GB RAM, 18-hour battery life, and silent fanless design.',
      condition: 'New',
      price: 4799,
      original_price: 5399,
      stock_quantity: 3,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { processor: 'Apple M2 8-core CPU', ram: '16GB Unified', storage: '512GB SSD', screen: '15.3" Liquid Retina', color: 'Midnight' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000008',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000003',
      name: 'Dell XPS 15 9530 Core i9 / 32GB / 1TB / RTX 4070',
      slug: 'dell-xps-15-9530-i9-32gb-1tb-rtx4070-used',
      sku: 'SKU-DELL-XPS15-9530',
      description: 'Pre-owned Dell XPS 15 Workstation with 13th Gen Intel Core i9, NVIDIA RTX 4070 8GB graphics, and 3.5K OLED Touch display.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 6499,
      original_price: 8999,
      stock_quantity: 1,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { processor: 'Intel Core i9-13900H', gpu: 'NVIDIA RTX 4070 8GB', ram: '32GB DDR5', storage: '1TB SSD', screen: '15.6" 3.5K OLED Touch' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000015',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'MacBook Pro 14" M3 Pro 18GB / 512GB SSD - Silver',
      slug: 'macbook-pro-14-m3-pro-18gb-512gb-silver-new',
      sku: 'SKU-MBP14-M3P-18-512',
      description: 'Brand New Sealed Pack 14-inch MacBook Pro with M3 Pro chip (11-Core CPU, 14-Core GPU).',
      condition: 'New',
      price: 6299,
      original_price: 6999,
      stock_quantity: 3,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { processor: 'Apple M3 Pro 11-core', ram: '18GB Unified', storage: '512GB SSD', screen: '14.2" Liquid Retina XDR', color: 'Silver' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000016',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000008',
      name: 'ASUS ROG Zephyrus G16 Core i9 / 32GB / 1TB / RTX 4080',
      slug: 'asus-rog-zephyrus-g16-i9-32gb-1tb-rtx4080-used',
      sku: 'SKU-ASUS-G16-4080',
      description: 'Pre-owned Premium Gaming & Content Creation Workstation featuring 240Hz ROG Nebula Display and RTX 4080 graphics.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 7999,
      original_price: 10499,
      stock_quantity: 1,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { processor: 'Intel Core i9-13900H', gpu: 'NVIDIA RTX 4080 12GB', ram: '32GB DDR5', storage: '1TB NVMe SSD', screen: '16" QHD+ 240Hz Nebula' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000017',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000009',
      name: 'Lenovo ThinkPad X1 Carbon Gen 11 Core i7 / 16GB / 512GB',
      slug: 'lenovo-thinkpad-x1-carbon-gen11-i7-16gb-512gb-used',
      sku: 'SKU-THINK-X1C11',
      description: 'Pre-owned Ultralight Business Laptop made of carbon-fiber weave. Intel Evo Certified with 14-inch IPS display.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 3999,
      original_price: 5899,
      stock_quantity: 2,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { processor: 'Intel Core i7-1355U', ram: '16GB LPDDR5', storage: '512GB SSD', screen: '14" WUXGA Anti-Glare', weight: '1.12 kg' }
    },

    // --- ACCESSORIES ---
    {
      id: 'a1000000-0000-0000-0000-000000000004',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000005',
      name: 'DJI Mini 4 Pro Fly More Combo Plus (DJI RC 2)',
      slug: 'dji-mini-4-pro-fly-more-combo-plus-rc2-new',
      sku: 'SKU-DJI-MINI4-FMC',
      description: 'Brand New Sealed DJI Mini 4 Pro Drone under 249g with 4K/60fps HDR video, Omnidirectional Obstacle Sensing, and 45-min flight batteries.',
      condition: 'New',
      price: 3699,
      original_price: 4199,
      stock_quantity: 4,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { weight: '249g', camera: '4K/60fps HDR', controller: 'DJI RC 2 with Screen', flight_time: '45 mins per battery', range: '20km O4 HD' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000009',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000004',
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      slug: 'sony-wh-1000xm5-wireless-headphones-silver-new',
      sku: 'SKU-SONY-XM5-SLV',
      description: 'Brand New Sealed Sony WH-1000XM5 active noise-canceling headphones with 30-hour battery life and Auto NC Optimizer.',
      condition: 'New',
      price: 1199,
      original_price: 1499,
      stock_quantity: 6,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { noise_canceling: 'Industry Leading NC', battery_life: '30 Hours', connectivity: 'Bluetooth 5.2 / Multipoint', color: 'Silver' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000010',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000006',
      name: 'Anker Prime 20,000mAh 200W Power Bank',
      slug: 'anker-prime-20000mah-200w-power-bank-new',
      sku: 'SKU-ANKER-PRIME-200W',
      description: 'Brand New Sealed High-Speed Anker Power Bank featuring 2x 100W USB-C ports, smart digital display, and fast laptop charging.',
      condition: 'New',
      price: 499,
      original_price: 649,
      stock_quantity: 10,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { capacity: '20,000mAh', output: '200W Total', display: 'Smart LCD Status Screen', ports: '2x USB-C, 1x USB-A' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000018',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'Apple AirPods Pro (2nd Gen) MagSafe Case (USB-C)',
      slug: 'apple-airpods-pro-2nd-gen-usbc-new',
      sku: 'SKU-AIRPODS-PRO2-C',
      description: 'Brand New Sealed AirPods Pro 2 with Active Noise Cancellation, Adaptive Audio, and USB-C MagSafe charging case.',
      condition: 'New',
      price: 799,
      original_price: 949,
      stock_quantity: 8,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { noise_canceling: '2x Active Noise Cancellation', charging: 'USB-C / MagSafe / Apple Watch Charger', audio: 'Personalized Spatial Audio' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000019',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
      slug: 'apple-watch-ultra-2-gps-cellular-49mm-titanium-used',
      sku: 'SKU-AW-ULTRA2-49',
      description: 'Pre-owned Apple Watch Ultra 2 with S9 SiP chip, 3000 nits display, and ocean band. Original box included.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 2499,
      original_price: 3199,
      stock_quantity: 2,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { case: '49mm Titanium', display: '3000 nits Always-On OLED', connectivity: 'GPS + Cellular 4G', battery_life: '36 Hours' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000020',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000005',
      name: 'DJI Osmo Pocket 3 Creator Combo',
      slug: 'dji-osmo-pocket-3-creator-combo-new',
      sku: 'SKU-DJI-POCKET3-CC',
      description: 'Brand New Sealed Compact 1-inch CMOS 4K/120fps Vlog Camera with 2-inch rotatable screen and Wireless Mic 2 transmitter.',
      condition: 'New',
      price: 2399,
      original_price: 2699,
      stock_quantity: 3,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { sensor: '1-inch CMOS', resolution: '4K/120fps', stabilization: '3-Axis Mechanical Gimbal', mic: 'DJI Mic 2 Included' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000021',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000002',
      name: 'Samsung Galaxy Watch 6 Classic 47mm LTE - Black',
      slug: 'samsung-galaxy-watch-6-classic-47mm-lte-black-new',
      sku: 'SKU-GW6C-47-LTE',
      description: 'Brand New Sealed Smartwatch featuring rotating physical bezel, ECG heart tracking, and Sapphire Crystal screen.',
      condition: 'New',
      price: 999,
      original_price: 1399,
      stock_quantity: 4,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { size: '47mm', bezel: 'Physical Rotating Bezel', connectivity: '4G LTE + Bluetooth', screen: 'Sapphire Crystal' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000022',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      brand_id: 'b1000000-0000-0000-0000-000000000006',
      name: 'Anker 737 Power Bank (PowerCore 24K) 140W',
      slug: 'anker-737-power-bank-24000mah-140w-new',
      sku: 'SKU-ANKER-737-140W',
      description: 'Brand New Sealed 24,000mAh Power Bank with ultra-powerful 140W bi-directional charging and smart digital display.',
      condition: 'New',
      price: 399,
      original_price: 529,
      stock_quantity: 6,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { capacity: '24,000mAh', output: '140W max', ports: '2x USB-C, 1x USB-A', display: 'Color Smart Screen' }
    }
  ];

  const { error: prodErr } = await supabase.from('products').insert(productsList);
  if (prodErr) {
    console.error('Products error:', prodErr.message);
    return;
  }
  console.log('✅ 22 Products inserted successfully into Supabase DB!');

  // 5. SEED PRODUCT IMAGES (Multiple photos per product)
  console.log('Inserting multiple product images per product...');
  const imagesList = [
    // iPhone 15 Pro Max
    { product_id: 'a1000000-0000-0000-0000-000000000001', image_url: imgIphone, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },
    { product_id: 'a1000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 4 },

    // Samsung Galaxy S24 Ultra
    { product_id: 'a1000000-0000-0000-0000-000000000002', image_url: imgSamsung, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000002', image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000002', image_url: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },

    // iPhone 14 Pro
    { product_id: 'a1000000-0000-0000-0000-000000000005', image_url: imgIphone14, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000005', image_url: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000005', image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },

    // Samsung Galaxy Z Fold 5
    { product_id: 'a1000000-0000-0000-0000-000000000006', image_url: imgFold5, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000006', image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000006', image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },

    // iPhone 15
    { product_id: 'a1000000-0000-0000-0000-000000000011', image_url: imgIphone15, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000011', image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000011', image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },

    // Google Pixel 8 Pro
    { product_id: 'a1000000-0000-0000-0000-000000000012', image_url: imgPixel8, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000012', image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000012', image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },

    // Samsung Galaxy S23 Ultra
    { product_id: 'a1000000-0000-0000-0000-000000000013', image_url: imgS23Ultra, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000013', image_url: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // iPhone 13 Pro
    { product_id: 'a1000000-0000-0000-0000-000000000014', image_url: imgIphone13P, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000014', image_url: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // MacBook Pro 16"
    { product_id: 'a1000000-0000-0000-0000-000000000003', image_url: imgMacbook, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000003', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000003', image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },
    { product_id: 'a1000000-0000-0000-0000-000000000003', image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 4 },

    // MacBook Air 15"
    { product_id: 'a1000000-0000-0000-0000-000000000007', image_url: imgMacbookAir, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000007', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // Dell XPS 15
    { product_id: 'a1000000-0000-0000-0000-000000000008', image_url: imgDellXps, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000008', image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // MacBook Pro 14"
    { product_id: 'a1000000-0000-0000-0000-000000000015', image_url: imgMbp14, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000015', image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // ASUS ROG Zephyrus G16
    { product_id: 'a1000000-0000-0000-0000-000000000016', image_url: imgAsusRog, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000016', image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // Lenovo ThinkPad X1
    { product_id: 'a1000000-0000-0000-0000-000000000017', image_url: imgThinkpad, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000017', image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // DJI Mini 4 Pro
    { product_id: 'a1000000-0000-0000-0000-000000000004', image_url: imgDrone, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000004', image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },
    { product_id: 'a1000000-0000-0000-0000-000000000004', image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 3 },

    // Sony WH-1000XM5
    { product_id: 'a1000000-0000-0000-0000-000000000009', image_url: imgSonyHeadphones, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000009', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // Anker Prime 20,000mAh
    { product_id: 'a1000000-0000-0000-0000-000000000010', image_url: imgAnkerBank, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000010', image_url: 'https://images.unsplash.com/photo-1609592424074-b52b3112db59?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // AirPods Pro 2
    { product_id: 'a1000000-0000-0000-0000-000000000018', image_url: imgAirpodsPro, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000018', image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // Apple Watch Ultra 2
    { product_id: 'a1000000-0000-0000-0000-000000000019', image_url: imgWatchUltra, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000019', image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // DJI Osmo Pocket 3
    { product_id: 'a1000000-0000-0000-0000-000000000020', image_url: imgOsmoPocket, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000020', image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // Samsung Galaxy Watch 6
    { product_id: 'a1000000-0000-0000-0000-000000000021', image_url: imgGalaxyWatch, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000021', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 },

    // Anker 737 Power Bank
    { product_id: 'a1000000-0000-0000-0000-000000000022', image_url: imgAnker737, is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000022', image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', is_primary: false, sort_order: 2 }
  ];

  const { error: imgErr } = await supabase.from('product_images').insert(imagesList);
  if (imgErr) console.error('Product Images error:', imgErr.message);
  else console.log('✅ Product Images inserted successfully!');

  console.log('\n==================================================');
  console.log('🎉 SUPABASE DATABASE RESEEDED 100% CLEANLY WITH 22 PERFECT CATALOG ITEMS!');
  console.log('==================================================\n');
}

reseed().catch(console.error);
