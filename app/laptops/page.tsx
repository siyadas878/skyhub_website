import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductListingView } from '@/components/products/ProductListingView';
import { fetchProducts } from '@/lib/supabase/queries';
import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Laptop & MacBook Shop in Dubai | Apple M3 & Dell XPS',
  description: 'Buy Apple MacBook Pro M3, MacBook Air, Dell XPS OLED touch laptops & pro workstations with warranty at SKYHUB DUBAI in Al Rigga, Deira.',
  alternates: {
    canonical: `${siteUrl}/laptops`,
  },
  openGraph: {
    title: 'Laptop & MacBook Shop in Dubai | SKYHUB DUBAI',
    description: 'Apple MacBooks, Dell XPS and workstation laptops with official warranty in Deira Dubai.',
    url: `${siteUrl}/laptops`,
  },
};

export default async function LaptopsPage() {
  const products = await fetchProducts();

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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Suspense fallback={<div className="py-10 text-center text-xs text-slate-400">Loading Laptops catalog...</div>}>
            <ProductListingView
              badgeTag="LAPTOPS & MACBOOKS"
              pageTitle="MacBooks & Windows Laptops"
              pageSubtitle="Apple M3 Max MacBooks, Dell XPS OLED Touch laptops, and pro workstations in Dubai."
              products={laptopProducts}
              categoriesList={categoriesList}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

