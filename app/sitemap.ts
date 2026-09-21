import { MetadataRoute } from 'next';
import { fetchProducts } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyhubdubai.com';
  const products = await fetchProducts();

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const routes = [
    '',
    '/mobiles',
    '/laptops',
    '/accessories',
    '/location',
    '/services/mobile-phones',
    '/services/mobile-phone-repair',
    '/services/camera',
    '/services/camera-repair',
    '/services/laptop-computer',
    '/services/data-recovery',
    '/services/broadcasting-media',
    '/services/audio-visual',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.9,
  }));

  return [...routes, ...productUrls];
}
