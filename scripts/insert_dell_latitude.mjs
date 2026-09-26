import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'skyhub';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log('Inserting Dell Latitude 5480 product...');

  const localImgPath = path.join(process.cwd(), 'public/products/dell-latitude-5480.jpg');
  if (fs.existsSync(localImgPath)) {
    const fileBuffer = fs.readFileSync(localImgPath);
    const storagePath = 'products/dell-latitude-5480.jpg';
    const { error: uploadErr } = await supabase.storage.from(bucketName).upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

    if (uploadErr) console.warn('Warning uploading to Supabase storage:', uploadErr.message);
    else console.log('✅ Uploaded image to Supabase Storage!');
  }

  const imageUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/products/dell-latitude-5480.jpg`;
  const fallbackLocalUrl = '/products/dell-latitude-5480.jpg';

  const productId = 'a1000000-0000-0000-0000-000000000099';
  const dellBrandId = 'b1000000-0000-0000-0000-000000000003';
  const laptopCatId = 'c1000000-0000-0000-0000-000000000002';

  const productData = {
    id: productId,
    category_id: laptopCatId,
    brand_id: dellBrandId,
    name: 'Dell Latitude 5480 Core i5 6th Gen 8GB RAM 256GB SSD',
    slug: 'dell-latitude-5480-i5-6th-gen-8gb-256gb-ssd-used',
    sku: 'SKU-DELL-5480-I5',
    description: 'High-performance commercial Dell Latitude 5480 featuring Intel Core i5 6th Gen processor, 8GB DDR4 RAM, ultra-fast 256GB SSD, and 14-inch anti-glare HD display. Certified pre-owned / refurbished with 35-point quality inspection and official warranty.',
    condition: 'Used',
    condition_grade: 'Excellent',
    price: 899,
    original_price: 1399,
    stock_quantity: 8,
    is_available: true,
    featured: true,
    is_active: true,
    specifications: {
      model: 'Dell Latitude 5480',
      processor: 'Intel Core i5 - 6th Generation',
      ram: '8 GB DDR4',
      storage: '256 GB High-Speed SSD',
      display: '14-inch Anti-Glare HD',
      os: 'Windows 10 / 11 Pro',
      condition: 'Used / Refurbished (Grade A+)',
      warranty: 'SkyHub Store Warranty'
    }
  };

  // Upsert product
  const { error: prodErr } = await supabase.from('products').upsert([productData]);
  if (prodErr) console.error('Error inserting product:', prodErr.message);
  else console.log('✅ Product Dell Latitude 5480 inserted/updated!');

  // Upsert product image
  const { error: imgErr } = await supabase.from('product_images').upsert([
    {
      id: 'd1000000-0000-0000-0000-000000000099',
      product_id: productId,
      image_url: imageUrl,
      is_primary: true,
      sort_order: 1
    }
  ]);
  if (imgErr) console.error('Error inserting product image:', imgErr.message);
  else console.log('✅ Product Image inserted!');

  // Update Store Settings & Homepage Config to set Dell Latitude 5480 in Hero Section!
  const { data: currentHpRow } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 'f1000000-0000-0000-0000-000000000001')
    .single();

  let hpConfig = {};
  if (currentHpRow && currentHpRow.address) {
    try {
      hpConfig = JSON.parse(currentHpRow.address);
    } catch {
      hpConfig = {};
    }
  }

  const updatedHpConfig = {
    ...hpConfig,
    hero_badge: '• PRO BUSINESS LAPTOP • SPECIAL DUBAI OFFER',
    hero_title: 'Dell Latitude 5480 Core i5 Workstation',
    hero_subtitle: 'Supercharged for business & everyday tasks with Intel Core i5 6th Gen, 8GB DDR4 RAM, fast 256GB SSD, and 14-inch display. 35-Point Quality Verified in Dubai.',
    hero_primary_button_text: 'Shop Dell Latitude 5480',
    hero_primary_button_url: `/products/${productData.slug}`,
    hero_secondary_button_text: 'WhatsApp Inquiry',
    hero_rating_text: '4.9 ★ Rating',
    hero_rating_subtext: 'Over 2,500+ Verified Buyers in UAE',
    hero_image_url: imageUrl,
    main_featured_product_id: productId
  };

  const { error: updateHpErr } = await supabase.from('store_settings').upsert([
    {
      id: 'f1000000-0000-0000-0000-000000000001',
      store_name: '__HOMEPAGE_CONFIG__',
      phone: '+971 52 336 1092',
      whatsapp_number: '+971 52 336 1092',
      address: JSON.stringify(updatedHpConfig)
    }
  ]);

  if (updateHpErr) console.error('Error updating homepage hero section:', updateHpErr.message);
  else console.log('✅ Homepage Hero Section updated with Dell Latitude 5480!');

  console.log('All done successfully!');
}

run();
