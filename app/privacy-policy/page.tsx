import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Privacy Policy | SKYHUB DUBAI',
  description: 'Privacy Policy for SKYHUB DUBAI - Mobile phone, camera, laptop sales and services in Al Rigga, Deira, Dubai.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: September 2026</p>

          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-600 leading-relaxed border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">1. Customer Information & Inquiries</h3>
            <p>
              SKYHUB DUBAI respects customer privacy. When you contact us via WhatsApp, phone, or website contact forms, we only use your contact details to provide inventory quotes, answer device specifications, or coordinate store pickup.
            </p>

            <h3 className="text-sm font-bold text-slate-900">2. No Online Payment Data Collected</h3>
            <p>
              As a product catalogue store, SKYHUB DUBAI does not process credit cards or store financial banking details on this website. All transactions take place offline in person at our Dubai showroom or via official bank transfer upon invoice.
            </p>

            <h3 className="text-sm font-bold text-slate-900">3. Third Party Links & Analytics</h3>
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

