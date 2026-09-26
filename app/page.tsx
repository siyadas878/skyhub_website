'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { useStore } from '@/lib/supabase/store-context';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';
import { formatAED } from '@/lib/utils/currency';
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  ChevronRight,
  Phone,
  CheckCircle2,
  Quote
} from 'lucide-react';

export default function HomePage() {
  const { products, categories, storeSettings, homepageSettings } = useStore();

  const categoriesOverview = categories.length > 0
    ? categories.slice(0, 4).map((cat) => {
      const count = products.filter((p) => p.category_id === cat.id).length;
      return {
        name: cat.name,
        count: `${count} Items Available`,
        href: `/${cat.slug}`,
        image: cat.image_url || '/products/iphone-15-pro-max.png'
      };
    })
    : [
      { name: 'Mobile Phones', count: `${products.filter(p => p.category?.slug === 'mobiles' || p.category_id === 'c1000000-0000-0000-0000-000000000001').length || 12} Models Available`, href: '/mobiles', image: '/products/iphone-15-pro-max.png' },
      { name: 'Laptops & MacBooks', count: `${products.filter(p => p.category?.slug === 'laptops' || p.category_id === 'c1000000-0000-0000-0000-000000000002').length || 8} Models Available`, href: '/laptops', image: '/products/macbook-pro-16.png' },
      { name: 'Accessories & Drones', count: `${products.filter(p => p.category?.slug === 'accessories' || p.category_id === 'c1000000-0000-0000-0000-000000000003').length || 15} Items Available`, href: '/accessories', image: '/products/dji-mini-4-pro.png' },
      { name: 'Pre-Owned Devices', count: '35-Point Verified', href: '/mobiles?condition=Used', image: '/products/samsung-s24-ultra.png' },
    ];

  // Derive dynamic Bento products
  const mainFeaturedProduct = products.find((p) => p.id === homepageSettings?.main_featured_product_id) || products[0];

  const secondaryProductIds = homepageSettings?.secondary_featured_product_ids || [];
  const secondaryFeaturedProducts = secondaryProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const bentoRightProducts = secondaryFeaturedProducts.length >= 4
    ? secondaryFeaturedProducts.slice(0, 4)
    : products.slice(1, 5);

  // Derive dynamic Great Deals products
  const dealIds = homepageSettings?.deals_product_ids || [];
  const dealProducts = dealIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const finalDealProducts = dealProducts.length > 0 ? dealProducts : products.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 space-y-16 py-8">

        {/* ========================================================================= */}
        {/* SECTION 1: MODERN SPLIT HERO (Dynamic from Admin) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-sm relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-bold text-[#EA3829] tracking-widest uppercase flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA3829]" />
                <span>{homepageSettings?.hero_badge || '• FLAGSHIP TECHNOLOGY • DUBAI'}</span>
              </span>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
                {homepageSettings?.hero_title || 'Redefining Everyday Tech'}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed">
                {homepageSettings?.hero_subtitle || "Experience Dubai's top rated collection of brand new & pre-owned iPhones, MacBooks, Samsung Galaxy Ultra, and pro accessories."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={homepageSettings?.hero_primary_button_url || '/mobiles'}
                  className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>{homepageSettings?.hero_primary_button_text || 'Shop Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={generateGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B0F19] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-transform hover:scale-105 flex items-center space-x-2"
                >
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0" />
                  <span>{homepageSettings?.hero_secondary_button_text || 'WhatsApp Inquiry'}</span>
                </a>
              </div>

              {/* Customer Rating Social Proof Widget with Generated Person Avatars */}
              <div className="pt-6 flex items-center space-x-4 border-t border-slate-100">
                <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                  <div className="relative h-9 w-9 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-slate-100">
                    <Image src="/avatars/customer-4.png" alt="Mohammed Al-Hashemi" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="relative h-9 w-9 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-slate-100">
                    <Image src="/avatars/customer-2.png" alt="Sarah Jenkins" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="relative h-9 w-9 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-slate-100">
                    <Image src="/avatars/customer-1.png" alt="Alexey Volkov" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="relative h-9 w-9 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-slate-100">
                    <Image src="/avatars/customer-3.png" alt="Tariq Al-Maktoum" fill className="object-cover" sizes="36px" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-sm font-black text-slate-900">{homepageSettings?.hero_rating_text || '4.9 ★ Rating'}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{homepageSettings?.hero_rating_subtext || 'Over 2,500+ Verified Buyers in UAE'}</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md bg-[#0B0F19] rounded-3xl border border-slate-800 shadow-xl overflow-hidden group">
                <Image
                  src={homepageSettings?.hero_image_url || '/products/dell-latitude-5480.jpg'}
                  alt="Hero Feature"
                  fill
                  className="object-cover scale-[1.03] group-hover:scale-108 transition-transform duration-500"
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 400px"
                />

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur border border-slate-200 rounded-full px-3 py-1.5 shadow-md flex items-center space-x-1.5 z-10">
                  <ShieldCheck className="w-4 h-4 text-[#EA3829]" />
                  <span className="text-[11px] font-bold text-slate-900">35-Point Quality Tested</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: "Best Picks For You" (Asymmetric Bento Grid Widget - Dynamic) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                • FEATURED SELECTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {homepageSettings?.best_picks_title || 'Best Picks For You'}
              </h2>
            </div>
            <Link href="/mobiles" className="text-xs font-bold text-white bg-[#0B0F19] hover:bg-[#EA3829] px-4 py-2 rounded-full transition-colors flex items-center space-x-1 shrink-0">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Bento Card 1 (Tall Left Feature Card) */}
            {mainFeaturedProduct && (
              <div className="lg:col-span-5 bg-[#0B0F19] text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-xl group border border-slate-800/80">
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#EA3829] px-3 py-1 rounded-full text-white inline-block shadow-md">
                    Flagship Item
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                    {mainFeaturedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {mainFeaturedProduct.condition} • {mainFeaturedProduct.sku || 'Official Store Stock'}
                  </p>
                  <p className="text-2xl font-black text-[#EA3829] pt-1">{formatAED(mainFeaturedProduct.price)}</p>
                </div>

                <div className="relative aspect-[4/3] w-full my-4 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#070C1B]">
                  <Image
                    src={mainFeaturedProduct.images?.[0]?.image_url || mainFeaturedProduct.image_url || '/products/dell-latitude-5480.jpg'}
                    alt={mainFeaturedProduct.name}
                    fill
                    className="object-cover object-center scale-[1.03] group-hover:scale-108 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="relative z-10 pt-1">
                  <Link
                    href={`/products/${mainFeaturedProduct.slug}`}
                    className="w-full bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-transform hover:scale-102 shadow-lg"
                  >
                    <span>Explore Device</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Bento Grid Right Cards (4 Dynamic Grid Widgets) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {bentoRightProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {product.brand?.name || 'Featured'}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#EA3829] transition-colors truncate max-w-[200px]">
                        {product.name}
                      </h4>
                      <span className="text-sm font-black text-[#EA3829] block mt-1">{formatAED(product.price)}</span>
                    </div>
                  </div>

                  <div className="relative aspect-video w-full my-3 bg-[#0B0F19] rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={product.images?.[0]?.image_url || product.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="200px"
                    />
                  </div>

                  <Link href={`/products/${product.slug}`} className="text-xs font-bold text-slate-900 hover:text-[#EA3829] flex items-center justify-between border-t border-slate-100 pt-3">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 text-[#EA3829]" />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: "New Arrivals" Product Grid */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                • NEW ARRIVALS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Fresh Inventory in Dubai Store
              </h2>
            </div>
            <Link href="/mobiles" className="text-xs font-bold text-white bg-[#0B0F19] hover:bg-[#EA3829] px-4 py-2 rounded-full transition-colors flex items-center space-x-1 shrink-0">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: Flagship Showcase Banner 1 (Dynamic) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-800 shadow-2xl">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest bg-[#EA3829] px-3 py-1 rounded-full text-white inline-block">
                {homepageSettings?.banner1_badge || 'Next-Gen Foldable & Ultra'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {homepageSettings?.banner1_title || 'Samsung Galaxy S24 Ultra & Fold Series'}
              </h2>
              <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                {homepageSettings?.banner1_subtitle || 'Powered by Galaxy AI, 200MP camera technology, built-in S-Pen, and 12GB RAM for ultimate productivity.'}
              </p>
              <div className="pt-2">
                <Link
                  href={homepageSettings?.banner1_button_url || '/mobiles?brand=samsung'}
                  className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs px-6 py-3.5 rounded-full inline-flex items-center space-x-2 transition-transform hover:scale-105 shadow-md"
                >
                  <span>{homepageSettings?.banner1_button_text || 'Explore Samsung Line-up'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-square w-full max-w-sm mx-auto">
              <Image
                src={homepageSettings?.banner1_image_url || '/products/samsung-s24-ultra.png'}
                alt="Showcase Banner 1"
                fill
                className="object-contain"
                sizes="350px"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: "Shop By Category" & Dual Side-by-Side Promo Banners (Dynamic) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                • CATEGORIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explore Product Categories
              </h2>
            </div>
            <Link href="/mobiles" className="text-xs font-bold text-white bg-[#0B0F19] hover:bg-[#EA3829] px-4 py-2 rounded-full transition-colors flex items-center space-x-1 shrink-0">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Curved Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {categoriesOverview.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="bg-white rounded-3xl p-6 flex flex-col items-center text-center group border border-slate-200/80 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square w-full max-w-[140px] mb-4 bg-[#0B0F19] rounded-2xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover scale-[1.03] group-hover:scale-110 transition-transform duration-300"
                    sizes="140px"
                  />
                </div>
                <span className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-[#EA3829] transition-colors">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium block mt-1">{item.count}</span>
              </Link>
            ))}
          </div>

          {/* Dual Side-by-Side Promotional Banners (Dynamic) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Banner */}
            <div className="bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm group hover:shadow-md transition-all">
              <div className="space-y-3 flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-[#EA3829] uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full inline-block border border-red-200">
                  {homepageSettings?.promo_left_badge || 'Drone & Fast Power'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {homepageSettings?.promo_left_title || 'DJI Drones & High-Speed Chargers'}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {homepageSettings?.promo_left_subtitle || 'Flagship DJI Mini 4 Pro 4K HDR drones and 200W high-speed power stations.'}
                </p>
                <div className="pt-1">
                  <Link
                    href={homepageSettings?.promo_left_button_url || '/accessories'}
                    className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs px-5 py-3 rounded-full inline-flex items-center space-x-2 shadow-md transition-transform hover:scale-105"
                  >
                    <span>{homepageSettings?.promo_left_button_text || 'Shop Accessories'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full sm:w-52 h-44 rounded-2xl overflow-hidden bg-[#0B0F19] border border-slate-800 shadow-xl shrink-0">
                <Image
                  src={homepageSettings?.promo_left_image_url || '/products/dji-mini-4-pro.png'}
                  alt="Left Promo"
                  fill
                  className="object-cover scale-[1.03] group-hover:scale-110 transition-transform duration-500"
                  sizes="220px"
                />
              </div>
            </div>

            {/* Right Banner */}
            <div className="bg-[#0B0F19] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl group hover:shadow-2xl transition-all">
              <div className="space-y-3 flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full inline-block border border-amber-400/30">
                  {homepageSettings?.promo_right_badge || 'M3 Max Performance'}
                </span>
                <h3 className="text-2xl font-black text-white leading-tight">
                  {homepageSettings?.promo_right_title || 'Apple MacBook Pro 16-inch'}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {homepageSettings?.promo_right_subtitle || 'Extreme performance 36GB / 1TB workstation with Liquid Retina XDR display.'}
                </p>
                <div className="pt-1">
                  <Link
                    href={homepageSettings?.promo_right_button_url || '/laptops'}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-5 py-3 rounded-full inline-flex items-center space-x-2 shadow-md transition-transform hover:scale-105"
                  >
                    <span>{homepageSettings?.promo_right_button_text || 'Shop Workstations'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#EA3829]" />
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full sm:w-52 h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl shrink-0">
                <Image
                  src={homepageSettings?.promo_right_image_url || '/products/macbook-pro-16.png'}
                  alt="Right Promo"
                  fill
                  className="object-cover scale-[1.03] group-hover:scale-110 transition-transform duration-500"
                  sizes="220px"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: "Top Trending" Product Grid */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                • TRENDING NOW
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Top Trending Devices
              </h2>
            </div>
            <Link href="/mobiles" className="text-xs font-bold text-white bg-[#0B0F19] hover:bg-[#EA3829] px-4 py-2 rounded-full transition-colors flex items-center space-x-1 shrink-0">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: Apple Showcase Banner 2 (Dynamic) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                {homepageSettings?.banner2_badge || 'Official Apple Showcase'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {homepageSettings?.banner2_title || 'Celebrate the Season with iPhone 15 Pro Max'}
              </h2>
              <p className="text-slate-600 text-sm max-w-lg leading-relaxed">
                {homepageSettings?.banner2_subtitle || 'Grade A+ Pre-Owned & Sealed devices with 35-point testing guarantee.'}
              </p>
              <div className="pt-2">
                <Link
                  href={homepageSettings?.banner2_button_url || '/mobiles?brand=apple'}
                  className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs px-6 py-3.5 rounded-full inline-flex items-center space-x-2 transition-transform hover:scale-105 shadow-md"
                >
                  <span>{homepageSettings?.banner2_button_text || 'Shop iPhones'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-square w-full max-w-xs mx-auto">
              <Image
                src={homepageSettings?.banner2_image_url || '/products/iphone-15-pro-max.png'}
                alt="Banner 2"
                fill
                className="object-contain"
                sizes="300px"
              />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: "Great Deals" Dynamic Section */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {homepageSettings?.deals_title || 'Great Deals'}
            </h2>
            <Link href="/mobiles" className="text-xs font-bold text-[#EA3829] hover:underline flex items-center space-x-1 shrink-0">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Dynamic Deal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {finalDealProducts.map((product) => (
              <div key={product.id} className="bg-[#0B0F19] text-white rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg group">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#EA3829] uppercase">{product.brand?.name || 'Deal'}</span>
                  <h4 className="text-lg font-bold truncate">{product.name}</h4>
                  <p className="text-sm font-black text-[#EA3829]">{formatAED(product.price)}</p>
                </div>
                <div className="relative aspect-video w-full my-3 bg-[#0B0F19] rounded-2xl overflow-hidden">
                  <Image
                    src={product.images?.[0]?.image_url || product.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    fill
                    className="object-cover scale-[1.03] group-hover:scale-108 transition-transform"
                    sizes="200px"
                  />
                </div>
                <Link href={`/products/${product.slug}`} className="bg-[#EA3829] hover:bg-[#D32F2F] text-white text-center font-bold text-xs py-2.5 rounded-xl shadow">
                  Shop Now
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: CUSTOMER REVIEWS & RATING PROFILES (Generated Persons Avatars) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                • VERIFIED CUSTOMER REVIEWS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Trusted by 2,500+ Buyers Across Dubai & UAE
              </h2>
            </div>

            <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-slate-900">4.9 out of 5</span>
                <span className="text-slate-500 ml-1 font-medium">(2,500+ Reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(homepageSettings?.customer_reviews && homepageSettings.customer_reviews.length > 0
              ? homepageSettings.customer_reviews
              : [
                {
                  id: '1',
                  name: 'Mohammed Al-Hashemi',
                  role: 'Verified Buyer • Deira, Dubai',
                  rating: 5,
                  avatar: '/avatars/customer-4.png',
                  reviewTitle: 'Best Mobile Shop in Deira!',
                  reviewText: 'Bought an iPhone 15 Pro Max from SKYHUB DUBAI. Device was 100% genuine sealed pack with official warranty. Fast WhatsApp response and friendly staff!',
                  date: '2 days ago'
                },
                {
                  id: '2',
                  name: 'Sarah Jenkins',
                  role: 'Content Creator • Downtown Dubai',
                  rating: 5,
                  avatar: '/avatars/customer-2.png',
                  reviewTitle: 'Amazing Camera & Drone Gear',
                  reviewText: 'Got the DJI Mini 4 Pro drone and wireless mics here. Honest pricing, great service, and they tested everything at their Fish Roundabout showroom.',
                  date: '1 week ago'
                },
                {
                  id: '3',
                  name: 'Alexey Volkov',
                  role: 'Software Engineer • Business Bay',
                  rating: 5,
                  avatar: '/avatars/customer-1.png',
                  reviewTitle: 'Pristine MacBook Pro M3',
                  reviewText: 'The MacBook Pro condition was beyond expectations! Zero scratches, 100% battery health, and saved over 1,500 AED compared to retail. Highly recommended!',
                  date: '2 weeks ago'
                },
                {
                  id: '4',
                  name: 'Tariq Al-Maktoum',
                  role: 'Business Owner • Jumeirah, Dubai',
                  rating: 5,
                  avatar: '/avatars/customer-3.png',
                  reviewTitle: 'Quick & Honest Service',
                  reviewText: 'Outstanding laptop repair & data recovery service. Restored all files from my corrupted SSD in less than 24 hours. Reliable team at SKYHUB.',
                  date: '3 weeks ago'
                }
              ]
            ).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Quote */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-slate-300 group-hover:text-[#EA3829] transition-colors" />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base leading-snug mb-1">
                      "{review.reviewTitle}"
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                      {review.reviewText}
                    </p>
                  </div>
                </div>

                {/* Profile Person Header */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center space-x-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0 bg-slate-100">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-extrabold text-slate-900 text-xs truncate">
                        {review.name}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 block truncate">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SHOWROOM LOCATION & CONTACT SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-[#0B0F19] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-800">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#EA3829] uppercase tracking-widest block">
                • VISIT OUR PHYSICAL SHOWROOM
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {storeSettings.store_name || 'SKYHUB DUBAI'}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {storeSettings.address || 'Fish Roundabout, Al Rigga, Deira, Dubai, United Arab Emirates'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <Phone className="w-4 h-4 text-[#EA3829]" />
                  <span>{storeSettings.phone || '+971 52 336 1092'}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-[#EA3829]" />
                  <span>{storeSettings.opening_hours || 'Sat - Thu: 10:00 AM - 10:00 PM'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${getPhoneNumber()}`}
                className="flex-1 bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-center py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store</span>
              </a>
              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-center py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0 brightness-0 invert" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
