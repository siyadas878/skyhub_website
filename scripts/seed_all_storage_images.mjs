import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'skyhub';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// High Quality Device Product Image Renders (SVG -> Buffer -> Supabase Storage Upload)
function createProductSvg(title, subtitle, category, bgGradientFrom, bgGradientTo, iconSymbol) {
  const svg = `
  <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradientFrom}" />
        <stop offset="100%" stop-color="${bgGradientTo}" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.95" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="800" height="800" fill="url(#bgGrad)" />
    <circle cx="400" cy="380" r="300" fill="#FFFFFF" fill-opacity="0.03" />

    <!-- Device Product Frame Card -->
    <rect x="100" y="100" width="600" height="600" rx="36" fill="url(#cardGrad)" stroke="#334155" stroke-width="3" filter="url(#shadow)" />

    <!-- Category Pill -->
    <rect x="140" y="140" width="160" height="36" rx="18" fill="#EA3829" />
    <text x="220" y="163" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${category.toUpperCase()}</text>

    <!-- Center Product Visual Graphic Icon -->
    <g transform="translate(400, 360)">
      <circle cx="0" cy="0" r="110" fill="#EA3829" fill-opacity="0.12" stroke="#EA3829" stroke-opacity="0.3" stroke-width="2" />
      <text x="0" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="90" text-anchor="middle" fill="#FFFFFF">${iconSymbol}</text>
    </g>

    <!-- Product Title & Specs Label -->
    <text x="400" y="550" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF" text-anchor="middle">${title}</text>
    <text x="400" y="595" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#94A3B8" text-anchor="middle">${subtitle}</text>
    <text x="400" y="640" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#38BDF8" text-anchor="middle" letter-spacing="1">SKYHUB DUBAI • 35-POINT TESTED</text>
  </svg>
  `;
  return Buffer.from(svg);
}

const PRODUCT_ASSETS = [
  {
    fileName: 'dell-latitude-5480.jpg',
    productId: 'a1000000-0000-0000-0000-000000000099',
    title: 'Dell Latitude 5480',
    subtitle: 'Core i5 6th Gen • 8GB RAM • 256GB SSD',
    category: 'Laptops',
    from: '#0F172A', to: '#020617', symbol: '💻'
  },
  {
    fileName: 'iphone-15-pro-max.png',
    productId: 'a1000000-0000-0000-0000-000000000001',
    title: 'iPhone 15 Pro Max',
    subtitle: '256GB • Natural Titanium • A17 Pro',
    category: 'Mobiles',
    from: '#1E1B4B', to: '#0F172A', symbol: '📱'
  },
  {
    fileName: 'samsung-s24-ultra.png',
    productId: 'a1000000-0000-0000-0000-000000000002',
    title: 'Samsung S24 Ultra',
    subtitle: '512GB • Titanium Black • Galaxy AI',
    category: 'Mobiles',
    from: '#020617', to: '#1E293B', symbol: '📱'
  },
  {
    fileName: 'macbook-pro-16.png',
    productId: 'a1000000-0000-0000-0000-000000000003',
    title: 'MacBook Pro 16"',
    subtitle: 'M3 Max • 36GB RAM • 1TB SSD',
    category: 'Laptops',
    from: '#111827', to: '#030712', symbol: '💻'
  },
  {
    fileName: 'dji-mini-4-pro.png',
    productId: 'a1000000-0000-0000-0000-000000000004',
    title: 'DJI Mini 4 Pro',
    subtitle: 'Fly More Combo Plus • 4K/60fps HDR',
    category: 'Accessories',
    from: '#065F46', to: '#022C22', symbol: '🛸'
  },
  {
    fileName: 'iphone-14-pro.png',
    productId: 'a1000000-0000-0000-0000-000000000005',
    title: 'iPhone 14 Pro',
    subtitle: '128GB • Deep Purple • Dynamic Island',
    category: 'Mobiles',
    from: '#3B0764', to: '#0F172A', symbol: '📱'
  },
  {
    fileName: 'samsung-z-fold-5.png',
    productId: 'a1000000-0000-0000-0000-000000000006',
    title: 'Galaxy Z Fold 5',
    subtitle: '512GB • Phantom Black • 7.6" Main',
    category: 'Mobiles',
    from: '#0F172A', to: '#18181B', symbol: '📱'
  },
  {
    fileName: 'macbook-air-15.png',
    productId: 'a1000000-0000-0000-0000-000000000007',
    title: 'MacBook Air 15"',
    subtitle: 'M2 Chip • 16GB RAM • 512GB SSD',
    category: 'Laptops',
    from: '#0F172A', to: '#1E1B4B', symbol: '💻'
  },
  {
    fileName: 'dell-xps-15.png',
    productId: 'a1000000-0000-0000-0000-000000000008',
    title: 'Dell XPS 15 9530',
    subtitle: 'Core i9 • 32GB • 1TB • RTX 4070',
    category: 'Laptops',
    from: '#1E293B', to: '#0F172A', symbol: '💻'
  },
  {
    fileName: 'sony-wh-1000xm5.png',
    productId: 'a1000000-0000-0000-0000-000000000009',
    title: 'Sony WH-1000XM5',
    subtitle: 'Wireless Active Noise Cancellation',
    category: 'Accessories',
    from: '#1C1917', to: '#0C0A09', symbol: '🎧'
  },
  {
    fileName: 'anker-prime-200w.png',
    productId: 'a1000000-0000-0000-0000-000000000010',
    title: 'Anker Prime 200W',
    subtitle: '20,000mAh • High-Speed Power Bank',
    category: 'Accessories',
    from: '#030712', to: '#1E293B', symbol: '⚡'
  },
  {
    fileName: 'iphone-15-blue.png',
    productId: 'a1000000-0000-0000-0000-000000000011',
    title: 'iPhone 15 128GB',
    subtitle: 'Color-Infused Blue • 48MP Camera',
    category: 'Mobiles',
    from: '#0369A1', to: '#0F172A', symbol: '📱'
  },
  {
    fileName: 'google-pixel-8-pro.png',
    productId: 'a1000000-0000-0000-0000-000000000012',
    title: 'Pixel 8 Pro 256GB',
    subtitle: 'Obsidian • Tensor G3 • 120Hz OLED',
    category: 'Mobiles',
    from: '#1E293B', to: '#020617', symbol: '📱'
  },
  {
    fileName: 'samsung-s23-ultra.png',
    productId: 'a1000000-0000-0000-0000-000000000013',
    title: 'Galaxy S23 Ultra',
    subtitle: '256GB • Green • 200MP + 10x Zoom',
    category: 'Mobiles',
    from: '#064E3B', to: '#022C22', symbol: '📱'
  },
  {
    fileName: 'iphone-13-pro.png',
    productId: 'a1000000-0000-0000-0000-000000000014',
    title: 'iPhone 13 Pro',
    subtitle: '256GB • Sierra Blue • 120Hz ProMotion',
    category: 'Mobiles',
    from: '#0C4A6E', to: '#0F172A', symbol: '📱'
  },
  {
    fileName: 'macbook-pro-14.png',
    productId: 'a1000000-0000-0000-0000-000000000015',
    title: 'MacBook Pro 14"',
    subtitle: 'M3 Pro • 18GB RAM • 512GB SSD',
    category: 'Laptops',
    from: '#334155', to: '#0F172A', symbol: '💻'
  },
  {
    fileName: 'asus-rog-zephyrus.png',
    productId: 'a1000000-0000-0000-0000-000000000016',
    title: 'ASUS ROG Zephyrus',
    subtitle: 'G16 Core i9 • 32GB • 1TB • RTX 4080',
    category: 'Laptops',
    from: '#881337', to: '#0F172A', symbol: '💻'
  },
  {
    fileName: 'lenovo-thinkpad-x1.png',
    productId: 'a1000000-0000-0000-0000-000000000017',
    title: 'ThinkPad X1 Carbon',
    subtitle: 'Gen 11 Core i7 • 16GB • 512GB SSD',
    category: 'Laptops',
    from: '#18181B', to: '#09090B', symbol: '💻'
  },
  {
    fileName: 'apple-airpods-pro-2.png',
    productId: 'a1000000-0000-0000-0000-000000000018',
    title: 'AirPods Pro 2',
    subtitle: 'USB-C MagSafe Case • Active Noise Cancellation',
    category: 'Accessories',
    from: '#0F172A', to: '#1E293B', symbol: '🎧'
  },
  {
    fileName: 'apple-watch-ultra-2.png',
    productId: 'a1000000-0000-0000-0000-000000000019',
    title: 'Apple Watch Ultra 2',
    subtitle: '49mm Titanium • GPS + Cellular • 3000 nits',
    category: 'Accessories',
    from: '#7C2D12', to: '#0F172A', symbol: '⌚'
  },
  {
    fileName: 'dji-osmo-pocket-3.png',
    productId: 'a1000000-0000-0000-0000-000000000020',
    title: 'DJI Osmo Pocket 3',
    subtitle: 'Creator Combo • 1" CMOS 4K/120fps',
    category: 'Accessories',
    from: '#047857', to: '#064E3B', symbol: '📷'
  },
  {
    fileName: 'samsung-galaxy-watch-6.png',
    productId: 'a1000000-0000-0000-0000-000000000021',
    title: 'Galaxy Watch 6 Classic',
    subtitle: '47mm LTE • Rotating Bezel • Sapphire Glass',
    category: 'Accessories',
    from: '#18181B', to: '#030712', symbol: '⌚'
  },
  {
    fileName: 'anker-737-powerbank.png',
    productId: 'a1000000-0000-0000-0000-000000000022',
    title: 'Anker 737 Power Bank',
    subtitle: '24,000mAh • 140W Bi-Directional Charging',
    category: 'Accessories',
    from: '#0F172A', to: '#020617', symbol: '⚡'
  }
];

async function run() {
  console.log('🚀 Starting complete upload of ALL product images directly into Supabase Storage bucket:', bucketName);

  for (const item of PRODUCT_ASSETS) {
    const buffer = createProductSvg(item.title, item.subtitle, item.category, item.from, item.to, item.symbol);
    const storagePath = `products/${item.fileName}`;

    const { error: uploadErr } = await supabase.storage.from(bucketName).upload(storagePath, buffer, {
      contentType: 'image/svg+xml',
      upsert: true
    });

    if (uploadErr) {
      console.error(`❌ Upload error for ${item.fileName}:`, uploadErr.message);
    } else {
      console.log(`✅ Uploaded to Supabase Storage: ${storagePath}`);
    }

    const publicStorageUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;

    // Update product_images table to point 100% to Supabase Storage!
    await supabase.from('product_images').delete().eq('product_id', item.productId);
    const { error: imgErr } = await supabase.from('product_images').insert([{
      product_id: item.productId,
      image_url: publicStorageUrl,
      is_primary: true,
      sort_order: 1
    }]);

    if (imgErr) {
      console.error(`❌ DB error updating product_images for ${item.title}:`, imgErr.message);
    } else {
      console.log(`  └ DB product_images updated for ${item.title}`);
    }
  }

  // Update categories images to point to Supabase Storage
  console.log('\nUpdating Category images to Supabase Storage...');
  const catUpdates = [
    { id: 'c1000000-0000-0000-0000-000000000001', file: 'iphone-15-pro-max.png' },
    { id: 'c1000000-0000-0000-0000-000000000002', file: 'macbook-pro-16.png' },
    { id: 'c1000000-0000-0000-0000-000000000003', file: 'dji-mini-4-pro.png' }
  ];

  for (const cat of catUpdates) {
    const catUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/${cat.file}`;
    await supabase.from('categories').update({ image_url: catUrl }).eq('id', cat.id);
  }
  console.log('✅ Categories updated to Supabase Storage URLs!');

  // Update homepage config store_settings to use Supabase Storage URLs
  console.log('\nUpdating Homepage Config store_settings to Supabase Storage URLs...');
  const hpConfig = {
    hero_badge: '• PRO BUSINESS LAPTOP • SPECIAL DUBAI OFFER',
    hero_title: 'Dell Latitude 5480 Core i5 Workstation',
    hero_subtitle: 'Supercharged for business & everyday tasks with Intel Core i5 6th Gen, 8GB DDR4 RAM, fast 256GB SSD, and 14-inch display. 35-Point Quality Verified in Dubai.',
    hero_primary_button_text: 'Shop Dell Latitude 5480',
    hero_primary_button_url: '/products/dell-latitude-5480-i5-6th-gen-8gb-256gb-ssd-used',
    hero_secondary_button_text: 'WhatsApp Inquiry',
    hero_rating_text: '4.9 ★ Rating',
    hero_rating_subtext: 'Over 2,500+ Verified Buyers in UAE',
    hero_image_url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/dell-latitude-5480.jpg`,
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
    ]
  };

  await supabase.from('store_settings').upsert([{
    id: 'f1000000-0000-0000-0000-000000000001',
    store_name: '__HOMEPAGE_CONFIG__',
    phone: '+971 52 336 1092',
    whatsapp_number: '+971 52 336 1092',
    address: JSON.stringify(hpConfig)
  }]);

  console.log('🎉 ALL PRODUCT IMAGES UPLOADED TO SUPABASE STORAGE & DATABASE 100% UPDATED!');
}

run().catch(console.error);
