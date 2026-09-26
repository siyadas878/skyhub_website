import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkAndClean() {
  console.log('Fetching all products currently in the database...');
  const { data: products, error } = await supabase.from('products').select('id, name, slug');
  
  if (error) {
    console.error('Error fetching products:', error.message);
    return;
  }

  console.log(`Total products in database: ${products.length}`);
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.id}] ${p.name} (slug: ${p.slug})`);
  });

  const validIds = [
    'a1000000-0000-0000-0000-000000000001', // Dell Latitude 5480
    'a1000000-0000-0000-0000-000000000002', // MacBook Pro 16
    'a1000000-0000-0000-0000-000000000003', // Dell XPS 15
    'a1000000-0000-0000-0000-000000000004', // Lenovo ThinkPad X1
    'a1000000-0000-0000-0000-000000000005', // ASUS ROG Zephyrus
    'a1000000-0000-0000-0000-000000000006', // MacBook Air 15
    'a1000000-0000-0000-0000-000000000007', // MacBook Pro 14
    'a1000000-0000-0000-0000-000000000008', // iPhone 15 Pro Max
    'a1000000-0000-0000-0000-000000000009', // Samsung S24 Ultra
    'a1000000-0000-0000-0000-000000000010', // Samsung Z Fold 5
    'a1000000-0000-0000-0000-000000000011', // Google Pixel 8 Pro
    'a1000000-0000-0000-0000-000000000012', // DJI Mini 4 Pro
    'a1000000-0000-0000-0000-000000000013', // Sony WH-1000XM5
  ];

  const productsToDelete = products.filter(p => !validIds.includes(p.id));
  
  if (productsToDelete.length > 0) {
    console.log(`Found ${productsToDelete.length} extra products to delete:`);
    productsToDelete.forEach(p => console.log(`- ${p.name} (${p.id})`));
    
    const idsToDelete = productsToDelete.map(p => p.id);
    await supabase.from('product_images').delete().in('product_id', idsToDelete);
    await supabase.from('product_variants').delete().in('product_id', idsToDelete);
    await supabase.from('product_inquiries').delete().in('product_id', idsToDelete);
    const { error: delErr } = await supabase.from('products').delete().in('id', idsToDelete);
    if (delErr) {
      console.error('Error deleting extra products:', delErr.message);
    } else {
      console.log('✅ Successfully deleted all extra products!');
    }
  } else {
    console.log('✨ Clean! Database contains ONLY the 13 newly generated products.');
  }
}

checkAndClean().catch(console.error);
