import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductListingView } from '@/components/products/ProductListingView';
import { fetchProducts } from '@/lib/supabase/queries';
import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Camera & Tech Accessories Shop in Dubai | DJI & Anker',
  description: 'Official DJI Drones, wireless microphones, Anker 140W fast chargers, MagSafe gear & tech accessories at SKYHUB DUBAI in Al Rigga, Deira.',
  alternates: {
    canonical: `${siteUrl}/accessories`,
  },
  openGraph: {
    title: 'Camera & Tech Accessories Shop in Dubai | SKYHUB DUBAI',
    description: 'Official DJI Drones, wireless mics, Anker fast chargers & tech accessories in Deira Dubai.',
    url: `${siteUrl}/accessories`,
  },
};

export default async function AccessoriesPage() {
  const products = await fetchProducts();

  const accessoryProducts = products.filter(
    (product) =>
      product.category_id === 'cat-accessories' ||
      product.category_id === 'c1000000-0000-0000-0000-000000000003' ||
      product.slug.includes('dji') ||
      product.slug.includes('anker') ||
      product.slug.includes('magsafe')
  );

  const categoriesList = [
    { id: 'dji', name: 'DJI Drones & Audio', count: accessoryProducts.filter((p) => p.slug.includes('dji') || p.brand?.slug === 'dji').length },
    { id: 'anker', name: 'Anker Power & Chargers', count: accessoryProducts.filter((p) => p.slug.includes('anker') || p.brand?.slug === 'anker').length },
    { id: 'apple', name: 'Apple Gear & Audio', count: accessoryProducts.filter((p) => p.slug.includes('apple') || p.slug.includes('airpods') || p.slug.includes('watch')).length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Suspense fallback={<div className="py-10 text-center text-xs text-slate-400">Loading Accessories catalog...</div>}>
            <ProductListingView
              badgeTag="ACCESSORIES & POWER"
              pageTitle="Tech Accessories & Power Banks"
              pageSubtitle="Official DJI Drones, Anker 140W Fast Power Banks, MagSafe chargers, and essential accessories."
              products={accessoryProducts}
              categoriesList={categoriesList}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

