'use client';

import React from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] text-slate-100">
      <TopHeader />
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last updated: September 20, 2026</p>

          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 text-xs text-slate-300 leading-relaxed border border-sky-900/30">
            <h3 className="text-sm font-bold text-white">1. Product Availability & Prices</h3>
            <p>
              Listed prices in UAE Dirhams (AED) and inventory quantities for pre-owned smartphones and laptops are subject to real-time store availability. For pre-owned devices, each physical unit has unique condition grades and battery health ratings.
            </p>

            <h3 className="text-sm font-bold text-white">2. Device Inspection & Warranty</h3>
            <p>
              New sealed products carry standard manufacturer warranties. Pre-owned and refurbished devices carry store warranty inspection guarantees as specified on the store invoice during purchase.
            </p>

            <h3 className="text-sm font-bold text-white">3. Store Pickup & WhatsApp Reservations</h3>
            <p>
              Customers may request temporary device holds or physical device photos by messaging our Dubai store team on WhatsApp before visiting.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
