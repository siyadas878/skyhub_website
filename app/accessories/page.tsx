import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductListingView } from '@/components/products/ProductListingView';
import { fetchProducts } from '@/lib/supabase/queries';
import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Camera & Tech Accessories Shop in Dubai | DJI & Sony',
  description: 'Official DJI Drones, wireless microphones, Sony active noise-canceling headphones & tech accessories at SKYHUB DUBAI in Al Rigga, Deira.',
  alternates: {
    canonical: `${siteUrl}/accessories`,
  },
  openGraph: {
    title: 'Camera & Tech Accessories Shop in Dubai | SKYHUB DUBAI',
    description: 'Official DJI Drones, wireless mics, Sony audio & tech accessories in Deira Dubai.',
    url: `${siteUrl}/accessories`,
  },
};

export default async function AccessoriesPage() {
  const products = await fetchProducts();

  // Strict Accessories Category Filter
  const accessoryProducts = products.filter(
    (product) =>
      product.category?.slug === 'accessories' ||
      product.category_id === 'c1000000-0000-0000-0000-000000000003'
  );

  const categoriesList = [
    { id: 'dji', name: 'DJI Drones & Audio', count: accessoryProducts.filter((p) => p.brand?.slug === 'dji').length },
    { id: 'sony', name: 'Sony Audio', count: accessoryProducts.filter((p) => p.brand?.slug === 'sony').length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Suspense fallback={<div className="py-10 text-center text-xs text-slate-400">Loading Accessories catalog...</div>}>
            <ProductListingView
              badgeTag="ACCESSORIES & AUDIO"
              pageTitle="Tech Accessories & Audio Gear"
              pageSubtitle="Official DJI Drones, Sony noise-canceling headphones, and essential creative accessories."
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
