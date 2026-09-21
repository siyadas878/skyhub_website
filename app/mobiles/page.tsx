'use client';

import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductListingView } from '@/components/products/ProductListingView';
import { useStore } from '@/lib/supabase/store-context';

function MobilesContent() {
  const { products } = useStore();

  const mobileProducts = products.filter(
    (product) =>
      product.category_id === 'cat-mobiles' ||
      product.category_id === 'c1000000-0000-0000-0000-000000000001' ||
      product.slug.includes('iphone') ||
      product.slug.includes('samsung')
  );

  const categoriesList = [
    { id: 'apple', name: 'Apple (iPhone)', count: mobileProducts.filter((p) => p.slug.includes('iphone') || p.brand?.slug === 'apple').length },
    { id: 'samsung', name: 'Samsung Galaxy', count: mobileProducts.filter((p) => p.slug.includes('samsung') || p.brand?.slug === 'samsung').length },
  ];

  return (
    <ProductListingView
      badgeTag="MOBILE PHONES"
      pageTitle="Smartphones & Mobile Devices"
      pageSubtitle="Browse premium new and quality-guaranteed pre-owned iPhones and Samsung Galaxy devices."
      products={mobileProducts}
      categoriesList={categoriesList}
    />
  );
}

export default function MobilesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Suspense fallback={<div className="text-slate-500 text-xs py-10 text-center">Loading smartphones inventory...</div>}>
            <MobilesContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

