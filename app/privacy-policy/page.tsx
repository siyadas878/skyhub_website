'use client';

import React from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] text-slate-100">
      <TopHeader />
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: September 20, 2026</p>

          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 text-xs text-slate-300 leading-relaxed border border-sky-900/30">
            <h3 className="text-sm font-bold text-white">1. Customer Information & Inquiries</h3>
            <p>
              SkyHub Media Trading LLC respects customer privacy. When you contact us via WhatsApp, phone, or website contact forms, we only use your contact details to provide inventory quotes, answer device specifications, or coordinate store pickup.
            </p>

            <h3 className="text-sm font-bold text-white">2. No Online Payment Data Collected</h3>
            <p>
              As a product catalogue store, SkyHub Media does not process credit cards or store financial banking details on this website. All transactions take place offline in person at our Dubai showroom or via official bank transfer upon invoice.
            </p>

            <h3 className="text-sm font-bold text-white">3. Third Party Links & Analytics</h3>
            <p>
              We may utilize standard web analytics to monitor popular product catalogue views and WhatsApp click-through rates to improve inventory selection.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
