import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductListingView } from '@/components/products/ProductListingView';
import { fetchProducts } from '@/lib/supabase/queries';
import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Mobile Phone Shop in Deira Dubai | iPhones & Samsung',
  description: 'Shop new & pre-owned iPhones, Samsung Galaxy Ultra smartphones with 35-point testing and official warranty at SKYHUB DUBAI in Al Rigga, Deira.',
  alternates: {
    canonical: `${siteUrl}/mobiles`,
  },
  openGraph: {
    title: 'Mobile Phone Shop in Deira Dubai | SKYHUB DUBAI',
    description: 'Shop new & pre-owned iPhones, Samsung Galaxy Ultra smartphones with warranty at SKYHUB DUBAI in Al Rigga, Deira.',
    url: `${siteUrl}/mobiles`,
  },
};

export default async function MobilesPage() {
  const products = await fetchProducts();

  // Strict Mobile Phones Category Filter
  const mobileProducts = products.filter(
    (product) =>
      product.category?.slug === 'mobiles' ||
      product.category_id === 'c1000000-0000-0000-0000-000000000002'
  );

  const categoriesList = [
    { id: 'apple', name: 'Apple (iPhone)', count: mobileProducts.filter((p) => p.brand?.slug === 'apple').length },
    { id: 'samsung', name: 'Samsung Galaxy', count: mobileProducts.filter((p) => p.brand?.slug === 'samsung').length },
    { id: 'google', name: 'Google Pixel', count: mobileProducts.filter((p) => p.brand?.slug === 'google').length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Suspense fallback={<div className="py-10 text-center text-xs text-slate-400">Loading Smartphones catalog...</div>}>
            <ProductListingView
              badgeTag="MOBILE PHONES"
              pageTitle="Smartphones & Mobile Devices"
              pageSubtitle="Browse premium new and quality-guaranteed pre-owned iPhones, Samsung Galaxy, and Google Pixel devices."
              products={mobileProducts}
              categoriesList={categoriesList}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
