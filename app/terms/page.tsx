import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Terms & Conditions | SKYHUB DUBAI',
  description: 'Terms and Conditions for SKYHUB DUBAI - Mobile phone, camera, laptop sales and repair services in Deira, Dubai.',
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
          <p className="text-xs text-slate-500">Last updated: September 2026</p>

          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-600 leading-relaxed border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">1. Product Availability & Prices</h3>
            <p>
              Listed prices in UAE Dirhams (AED) and inventory quantities for pre-owned smartphones and laptops are subject to real-time store availability. For pre-owned devices, each physical unit has unique condition grades and battery health ratings.
            </p>

            <h3 className="text-sm font-bold text-slate-900">2. Device Inspection & Warranty</h3>
            <p>
              New sealed products carry standard manufacturer warranties. Pre-owned and refurbished devices carry store warranty inspection guarantees as specified on the store invoice during purchase.
            </p>

            <h3 className="text-sm font-bold text-slate-900">3. Store Pickup & WhatsApp Reservations</h3>
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

