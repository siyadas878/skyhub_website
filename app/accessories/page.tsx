'use client';

import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductListingView } from '@/components/products/ProductListingView';
import { useStore } from '@/lib/supabase/store-context';

function AccessoriesContent() {
  const { products } = useStore();

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
    <ProductListingView
      badgeTag="ACCESSORIES & POWER"
      pageTitle="Tech Accessories & Power Banks"
      pageSubtitle="Official DJI Drones, Anker 140W Fast Power Banks, MagSafe chargers, and essential accessories."
      products={accessoryProducts}
      categoriesList={categoriesList}
    />
  );
}

export default function AccessoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Suspense fallback={<div className="text-slate-500 text-xs py-10 text-center">Loading accessories inventory...</div>}>
            <AccessoriesContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
