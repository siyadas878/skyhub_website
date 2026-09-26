import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
} catch (e) {
  console.warn('Could not read .env file:', e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'skyhub';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const artifactDir = '/Users/mohammedsiyadh/.gemini/antigravity-ide/brain/9e2e5436-0fd7-4331-8125-041bc9fd062a';
const versionTag = Date.now();

// High resolution generated studio photography mapping
const imageMap = {
  'dell-latitude-5480.png': 'dell_latitude_5480_1790412930076.png',
  'macbook-pro-16.png': 'macbook_pro_16_1790412956851.png',
  'dell-xps-15.png': 'dell_xps_15_1790413047571.png',
  'lenovo-thinkpad-x1.png': 'lenovo_thinkpad_1790413073493.png',
  'asus-rog-zephyrus.png': 'asus_rog_zephyrus_1790413097937.png',
  'macbook-air-15.png': 'macbook_air_15_1790413123514.png',
  'macbook-pro-14.png': 'macbook_pro_14_1790413155675.png',
  'iphone-15-pro-max.png': 'iphone_15_pro_max_1790413190520.png',
  'samsung-s24-ultra.png': 'samsung_s24_ultra_1790412985973.png',
  'samsung-z-fold-5.png': 'samsung_z_fold5_1790413237596.png',
  'google-pixel-8-pro.png': 'google_pixel_8_pro_1790413281969.png',
  'dji-mini-4-pro.png': 'dji_mini_4_pro_1790413326011.png',
  'sony-wh-1000xm5.png': 'sony_wh1000xm5_1790413375497.png',
};

async function executeWipeAndReseed() {
  console.log('🚀 Step 1: Cleaning up Supabase Storage bucket:', bucketName);

  const { data: existingFiles } = await supabase.storage.from(bucketName).list('products/v2', { limit: 1000 });
  if (existingFiles && existingFiles.length > 0) {
    const filesToDelete = existingFiles.map((f) => `products/v2/${f.name}`);
    await supabase.storage.from(bucketName).remove(filesToDelete);
  }

  console.log('\n🚀 Step 2: Uploading fresh studio photos to products/v2/ in Supabase Storage...');
  const uploadedUrls = {};

  for (const [targetName, artifactFileName] of Object.entries(imageMap)) {
    const localFilePath = path.join(artifactDir, artifactFileName);
    if (!fs.existsSync(localFilePath)) {
      console.warn(`File not found locally: ${localFilePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localFilePath);
    const storagePath = `products/v2/${targetName}`;

    console.log(`Uploading ${targetName} to Supabase Storage at ${storagePath}...`);
    const { error: uploadErr } = await supabase.storage.from(bucketName).upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
      cacheControl: 'no-cache, max-age=0',
    });

    if (uploadErr) {
      console.error(`Failed to upload ${targetName}:`, uploadErr.message);
    } else {
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
      // Attach version query param to bypass all CDN and browser caches
      uploadedUrls[targetName] = `${publicUrlData.publicUrl}?v=${versionTag}`;
      console.log(`✅ Uploaded ${targetName} -> ${uploadedUrls[targetName]}`);
    }
  }

  console.log('\n🚀 Step 3: Clearing existing database tables...');
  await supabase.from('product_inquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('brands').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('store_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Database tables cleared!');

  console.log('\n🚀 Step 4: Seeding Categories (Priority: 1. Laptops, 2. Mobile Phones, 3. Accessories)...');
  const categories = [
    { id: 'c1000000-0000-0000-0000-000000000001', name: 'Laptops', slug: 'laptops', description: 'Pro MacBooks, Dell XPS, ThinkPads & High-Performance Workstations', image_url: uploadedUrls['dell-latitude-5480.png'], sort_order: 1 },
    { id: 'c1000000-0000-0000-0000-000000000002', name: 'Mobile Phones', slug: 'mobiles', description: 'Flagship iPhones, Samsung Galaxy & Google Pixel devices with 35-point guarantee', image_url: uploadedUrls['iphone-15-pro-max.png'], sort_order: 2 },
    { id: 'c1000000-0000-0000-0000-000000000003', name: 'Accessories', slug: 'accessories', description: 'DJI drones, Sony noise-canceling gear, fast power stations & smartwatches', image_url: uploadedUrls['dji-mini-4-pro.png'], sort_order: 3 },
  ];
  await supabase.from('categories').insert(categories);
  console.log('✅ Categories inserted!');

  console.log('\n🚀 Step 5: Seeding Brands...');
  const brands = [
    { id: 'b1000000-0000-0000-0000-000000000001', name: 'Dell', slug: 'dell' },
    { id: 'b1000000-0000-0000-0000-000000000002', name: 'Apple', slug: 'apple' },
    { id: 'b1000000-0000-0000-0000-000000000003', name: 'Samsung', slug: 'samsung' },
    { id: 'b1000000-0000-0000-0000-000000000004', name: 'Lenovo', slug: 'lenovo' },
    { id: 'b1000000-0000-0000-0000-000000000005', name: 'ASUS', slug: 'asus' },
    { id: 'b1000000-0000-0000-0000-000000000006', name: 'HP', slug: 'hp' },
    { id: 'b1000000-0000-0000-0000-000000000007', name: 'Sony', slug: 'sony' },
    { id: 'b1000000-0000-0000-0000-000000000008', name: 'DJI', slug: 'dji' },
    { id: 'b1000000-0000-0000-0000-000000000009', name: 'Anker', slug: 'anker' },
    { id: 'b1000000-0000-0000-0000-000000000010', name: 'Google', slug: 'google' },
  ];
  await supabase.from('brands').insert(brands);
  console.log('✅ Brands inserted!');

  console.log('\n🚀 Step 6: Seeding Products (13 clean studio-photography products)...');
  const productsList = [
    // --- 1. LAPTOPS (HIGHEST PRIORITY) ---
    {
      id: 'a1000000-0000-0000-0000-000000000001',
      category_id: 'c1000000-0000-0000-0000-000000000001', // Laptops
      brand_id: 'b1000000-0000-0000-0000-000000000001', // Dell
      name: 'Dell Latitude 5480 Core i5 - 8GB / 256GB SSD',
      slug: 'dell-latitude-5480-i5-6th-gen-8gb-256gb-ssd-used',
      sku: 'SKU-DELL-5480-I5',
      description: 'Business-class Dell Latitude 5480 laptop featuring Intel Core i5 6th Gen processor, 8GB DDR4 RAM, fast 256GB SSD, and 14-inch display. Thoroughly tested with 35-point quality assurance guarantee in Dubai.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 1199,
      original_price: 1699,
      stock_quantity: 5,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { processor: 'Intel Core i5 (6th Gen)', ram: '8GB DDR4', storage: '256GB M.2 SSD', display: '14-inch HD Anti-Glare', os: 'Windows 10 Pro Pre-installed' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000002',
      category_id: 'c1000000-0000-0000-0000-000000000001', // Laptops
      brand_id: 'b1000000-0000-0000-0000-000000000002', // Apple
      name: 'MacBook Pro 16" M3 Max 36GB / 1TB SSD - Space Black',
      slug: 'macbook-pro-16-m3-max-36gb-1tb-ssd-space-black-used',
      sku: 'SKU-MBP16-M3M-36-1T',
      description: 'Flagship pre-owned MacBook Pro 16-inch with M3 Max 14-Core CPU and 30-Core GPU. Extreme performance for 8K video editing and 3D rendering with Liquid Retina XDR display.',
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
      id: 'a1000000-0000-0000-0000-000000000003',
      category_id: 'c1000000-0000-0000-0000-000000000001', // Laptops
      brand_id: 'b1000000-0000-0000-0000-000000000001', // Dell
      name: 'Dell XPS 15 9530 Core i9 / 32GB / 1TB / RTX 4070',
      slug: 'dell-xps-15-9530-i9-32gb-1tb-rtx4070-used',
      sku: 'SKU-DELL-XPS15-9530',
      description: 'Pre-owned Dell XPS 15 Workstation with 13th Gen Intel Core i9, NVIDIA RTX 4070 8GB graphics, and 3.5K OLED Touch display.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 6499,
      original_price: 8999,
      stock_quantity: 2,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { processor: 'Intel Core i9-13900H', gpu: 'NVIDIA RTX 4070 8GB', ram: '32GB DDR5', storage: '1TB SSD', screen: '15.6" 3.5K OLED Touch' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000004',
      category_id: 'c1000000-0000-0000-0000-000000000001', // Laptops
      brand_id: 'b1000000-0000-0000-0000-000000000004', // Lenovo
      name: 'Lenovo ThinkPad X1 Carbon Gen 11 Core i7 / 16GB / 512GB',
      slug: 'lenovo-thinkpad-x1-carbon-gen11-i7-16gb-512gb-used',
      sku: 'SKU-THINK-X1C11',
      description: 'Pre-owned Ultralight Business Laptop made of carbon-fiber weave. Intel Evo Certified with 14-inch IPS display.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 3999,
      original_price: 5899,
      stock_quantity: 3,
      is_available: true,
      featured: true,
      is_active: true,
      specifications: { processor: 'Intel Core i7-1355U', ram: '16GB LPDDR5', storage: '512GB SSD', screen: '14" WUXGA Anti-Glare', weight: '1.12 kg' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000005',
      category_id: 'c1000000-0000-0000-0000-000000000001', // Laptops
      brand_id: 'b1000000-0000-0000-0000-000000000005', // ASUS
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
      featured: true,
      is_active: true,
      specifications: { processor: 'Intel Core i9-13900H', gpu: 'NVIDIA RTX 4080 12GB', ram: '32GB DDR5', storage: '1TB NVMe SSD', screen: '16" QHD+ 240Hz Nebula' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000006',
      category_id: 'c1000000-0000-0000-0000-000000000001', // Laptops
      brand_id: 'b1000000-0000-0000-0000-000000000002', // Apple
      name: 'MacBook Air 15" M2 16GB / 512GB SSD - Midnight',
      slug: 'macbook-air-15-m2-16gb-512gb-midnight-new',
      sku: 'SKU-MBA15-M2-16-512',
      description: 'Brand New Sealed 15-inch MacBook Air with M2 chip, 16GB RAM, 18-hour battery life, and silent fanless design.',
      condition: 'New',
      price: 4799,
      original_price: 5399,
      stock_quantity: 4,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { processor: 'Apple M2 8-core CPU', ram: '16GB Unified', storage: '512GB SSD', screen: '15.3" Liquid Retina', color: 'Midnight' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000007',
      category_id: 'c1000000-0000-0000-0000-000000000001', // Laptops
      brand_id: 'b1000000-0000-0000-0000-000000000002', // Apple
      name: 'MacBook Pro 14" M3 Pro 18GB / 512GB SSD - Silver',
      slug: 'macbook-pro-14-m3-pro-18gb-512gb-silver-new',
      sku: 'SKU-MBP14-M3P-18-512',
      description: 'Brand New Sealed Pack 14-inch MacBook Pro with M3 Pro chip (11-Core CPU, 14-Core GPU).',
      condition: 'New',
      price: 6299,
      original_price: 6999,
      stock_quantity: 3,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { processor: 'Apple M3 Pro 11-core', ram: '18GB Unified', storage: '512GB SSD', screen: '14.2" Liquid Retina XDR', color: 'Silver' }
    },

    // --- 2. MOBILE PHONES (SECOND PRIORITY) ---
    {
      id: 'a1000000-0000-0000-0000-000000000008',
      category_id: 'c1000000-0000-0000-0000-000000000002', // Mobiles
      brand_id: 'b1000000-0000-0000-0000-000000000002', // Apple
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
      id: 'a1000000-0000-0000-0000-000000000009',
      category_id: 'c1000000-0000-0000-0000-000000000002', // Mobiles
      brand_id: 'b1000000-0000-0000-0000-000000000003', // Samsung
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
      id: 'a1000000-0000-0000-0000-000000000010',
      category_id: 'c1000000-0000-0000-0000-000000000002', // Mobiles
      brand_id: 'b1000000-0000-0000-0000-000000000003', // Samsung
      name: 'Samsung Galaxy Z Fold 5 512GB - Phantom Black',
      slug: 'samsung-galaxy-z-fold-5-512gb-phantom-black-used',
      sku: 'SKU-ZFOLD5-512-BLK',
      description: 'Pre-owned Foldable Workstation Smartphone with 7.6-inch Dynamic AMOLED 2X interior screen and Flex Hinge technology.',
      condition: 'Used',
      condition_grade: 'Excellent',
      price: 3899,
      original_price: 5499,
      stock_quantity: 2,
      is_available: true,
      featured: false,
      is_active: true,
      specifications: { storage: '512GB', ram: '12GB', color: 'Phantom Black', screen: '7.6" Main + 6.2" Cover', processor: 'Snapdragon 8 Gen 2' }
    },
    {
      id: 'a1000000-0000-0000-0000-000000000011',
      category_id: 'c1000000-0000-0000-0000-000000000002', // Mobiles
      brand_id: 'b1000000-0000-0000-0000-000000000010', // Google
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

    // --- 3. ACCESSORIES (THIRD PRIORITY) ---
    {
      id: 'a1000000-0000-0000-0000-000000000012',
      category_id: 'c1000000-0000-0000-0000-000000000003', // Accessories
      brand_id: 'b1000000-0000-0000-0000-000000000008', // DJI
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
      id: 'a1000000-0000-0000-0000-000000000013',
      category_id: 'c1000000-0000-0000-0000-000000000003', // Accessories
      brand_id: 'b1000000-0000-0000-0000-000000000007', // Sony
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
    }
  ];

  await supabase.from('products').insert(productsList);
  console.log('✅ Products inserted into Supabase DB!');

  console.log('\n🚀 Step 7: Seeding Product Images with Fresh Storage URLs & Cache-Busters...');
  const imagesList = [
    { product_id: 'a1000000-0000-0000-0000-000000000001', image_url: uploadedUrls['dell-latitude-5480.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000002', image_url: uploadedUrls['macbook-pro-16.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000003', image_url: uploadedUrls['dell-xps-15.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000004', image_url: uploadedUrls['lenovo-thinkpad-x1.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000005', image_url: uploadedUrls['asus-rog-zephyrus.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000006', image_url: uploadedUrls['macbook-air-15.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000007', image_url: uploadedUrls['macbook-pro-14.png'], is_primary: true, sort_order: 1 },

    { product_id: 'a1000000-0000-0000-0000-000000000008', image_url: uploadedUrls['iphone-15-pro-max.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000009', image_url: uploadedUrls['samsung-s24-ultra.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000010', image_url: uploadedUrls['samsung-z-fold-5.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000011', image_url: uploadedUrls['google-pixel-8-pro.png'], is_primary: true, sort_order: 1 },

    { product_id: 'a1000000-0000-0000-0000-000000000012', image_url: uploadedUrls['dji-mini-4-pro.png'], is_primary: true, sort_order: 1 },
    { product_id: 'a1000000-0000-0000-0000-000000000013', image_url: uploadedUrls['sony-wh-1000xm5.png'], is_primary: true, sort_order: 1 },
  ];
  await supabase.from('product_images').insert(imagesList);
  console.log('✅ Product Images inserted!');

  console.log('\n🚀 Step 8: Seeding Store Settings & Default Homepage Config (Dell Latitude 5480 in Hero)...');
  const defaultHomepageConfig = {
    hero_badge: '• PRO BUSINESS LAPTOP • SPECIAL DUBAI OFFER',
    hero_title: 'Dell Latitude 5480 Core i5 Workstation',
    hero_subtitle: 'Supercharged for business & everyday tasks with Intel Core i5 6th Gen, 8GB DDR4 RAM, fast 256GB SSD, and 14-inch display. 35-Point Quality Verified in Dubai.',
    hero_primary_button_text: 'Shop Dell Latitude 5480',
    hero_primary_button_url: '/products/dell-latitude-5480-i5-6th-gen-8gb-256gb-ssd-used',
    hero_secondary_button_text: 'WhatsApp Inquiry',
    hero_rating_text: '4.9 ★ Rating',
    hero_rating_subtext: 'Over 2,500+ Verified Buyers in UAE',
    hero_image_url: uploadedUrls['dell-latitude-5480.png'],
    best_picks_title: 'Best Picks For You',
    main_featured_product_id: 'a1000000-0000-0000-0000-000000000001', // Dell Latitude 5480
    secondary_featured_product_ids: [
      'a1000000-0000-0000-0000-000000000002', // MacBook Pro 16
      'a1000000-0000-0000-0000-000000000003', // Dell XPS 15
      'a1000000-0000-0000-0000-000000000004', // Lenovo ThinkPad X1
      'a1000000-0000-0000-0000-000000000005', // ASUS ROG Zephyrus
    ],
    banner1_badge: 'High Performance Laptops',
    banner1_title: 'Apple MacBook Pro M3 Max & Workstations',
    banner1_subtitle: 'Extreme performance 36GB / 1TB workstation with Liquid Retina XDR display.',
    banner1_button_text: 'Explore Laptop Workstations',
    banner1_button_url: '/laptops',
    banner1_image_url: uploadedUrls['macbook-pro-16.png'],
    promo_left_badge: 'Official Mobile Showcase',
    promo_left_title: 'iPhone 15 Pro Max & Samsung S24 Ultra',
    promo_left_subtitle: 'Powered by Galaxy AI & Titanium finishes with 35-point testing guarantee.',
    promo_left_button_text: 'Shop Flagship Mobiles',
    promo_left_button_url: '/mobiles',
    promo_left_image_url: uploadedUrls['iphone-15-pro-max.png'],
    promo_right_badge: 'Drone & Audio Gear',
    promo_right_title: 'DJI Drones & Sony Audio',
    promo_right_subtitle: 'Flagship DJI Mini 4 Pro 4K HDR drones and Sony noise-canceling headphones.',
    promo_right_button_text: 'Shop Accessories',
    promo_right_button_url: '/accessories',
    promo_right_image_url: uploadedUrls['dji-mini-4-pro.png'],
    banner2_badge: 'Exclusive Business Workstations',
    banner2_title: 'Lenovo ThinkPad X1 & Dell XPS Series',
    banner2_subtitle: 'Grade A+ Pre-Owned & Sealed devices with 35-point testing guarantee and instant store pickup in Bur Dubai.',
    banner2_button_text: 'Shop Laptops',
    banner2_button_url: '/laptops',
    banner2_image_url: uploadedUrls['lenovo-thinkpad-x1.png'],
    deals_title: 'Great Laptop & Mobile Deals',
    deals_product_ids: [
      'a1000000-0000-0000-0000-000000000001',
      'a1000000-0000-0000-0000-000000000002',
      'a1000000-0000-0000-0000-000000000003',
    ],
    customer_reviews: [
      {
        id: 'rev-1',
        name: 'Mohammed Al-Hashemi',
        role: 'Verified Buyer • Deira, Dubai',
        rating: 5,
        avatar: '/avatars/customer-4.png',
        reviewTitle: 'Best Laptop Shop in Deira!',
        reviewText: 'Bought a Dell Latitude 5480 and MacBook Pro from SKYHUB DUBAI. Device was 100% genuine sealed pack with official warranty. Fast WhatsApp response!',
        date: '2 days ago'
      },
      {
        id: 'rev-2',
        name: 'Sarah Jenkins',
        role: 'Content Creator • Downtown Dubai',
        rating: 5,
        avatar: '/avatars/customer-2.png',
        reviewTitle: 'Amazing Drone & Laptop Gear',
        reviewText: 'Got the DJI Mini 4 Pro drone and MacBook Pro M3 Max here. Honest pricing, great service, and they tested everything at their Fish Roundabout showroom.',
        date: '1 week ago'
      }
    ]
  };

  await supabase.from('store_settings').insert([
    {
      id: 'e1000000-0000-0000-0000-000000000001',
      store_name: 'SKYHUB DUBAI',
      phone: '+971 52 336 1092',
      whatsapp_number: '+971 52 336 1092',
      email: 'info@skyhubdubai.com',
      address: 'Fish Roundabout, Al Rigga, Deira, Dubai, UAE',
      google_maps_url: 'https://www.google.com/maps',
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

  console.log('\n==================================================');
  console.log('🎉 SUPABASE STORAGE CLEANED & REPOPULATED WITH FRESH STUDIO PHOTOGRAPHY (PRODUCTS/V2)!');
  console.log('==================================================\n');
}

executeWipeAndReseed().catch(console.error);
