'use client';

import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductListingView } from '@/components/products/ProductListingView';
import { useStore } from '@/lib/supabase/store-context';

function LaptopsContent() {
  const { products } = useStore();

  const laptopProducts = products.filter(
    (product) =>
      product.category_id === 'cat-laptops' ||
      product.category_id === 'c1000000-0000-0000-0000-000000000002' ||
      product.slug.includes('macbook') ||
      product.slug.includes('dell')
  );

  const categoriesList = [
    { id: 'apple', name: 'Apple MacBook Pro & Air', count: laptopProducts.filter((p) => p.slug.includes('macbook') || p.brand?.slug === 'apple').length },
    { id: 'dell', name: 'Dell XPS & Workstations', count: laptopProducts.filter((p) => p.slug.includes('dell') || p.brand?.slug === 'dell').length },
  ];

  return (
    <ProductListingView
      badgeTag="LAPTOPS & MACBOOKS"
      pageTitle="MacBooks & Windows Laptops"
      pageSubtitle="Apple M3 Max MacBooks, Dell XPS OLED Touch laptops, and pro workstations in Dubai."
      products={laptopProducts}
      categoriesList={categoriesList}
    />
  );
}

export default function LaptopsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Suspense fallback={<div className="text-slate-500 text-xs py-10 text-center">Loading laptops inventory...</div>}>
            <LaptopsContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
