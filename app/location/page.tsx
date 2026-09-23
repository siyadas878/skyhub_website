import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BranchesSection } from '@/components/sections/BranchesSection';
import { MapPin, Phone, Clock, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';

import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'SKYHUB DUBAI – Mobile & Camera Shop in Al Rigga, Deira',
  description:
    'SKYHUB DUBAI is located near Fish Roundabout in Al Rigga, Deira, Dubai, United Arab Emirates. Visit our store for mobile phone sales, phone repair, camera sales & repair, laptop services, and data recovery.',
  alternates: {
    canonical: `${siteUrl}/location`,
  },
  keywords: [
    'SKYHUB DUBAI location',
    'Mobile phone shop in Al Rigga',
    'Mobile phone shop in Deira',
    'Camera shop near Fish Roundabout',
    'Phone repair Al Rigga Deira',
    'SKYHUB DUBAI'
  ],
};

export default function LocationPage() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const phone = getPhoneNumber();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SKYHUB DUBAI',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
    telephone: '+971523361092',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Fish Roundabout, Al Rigga',
      addressLocality: 'Deira, Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.2677',
      longitude: '55.3134',
    },
    url: `${siteUrl}/location`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 space-y-16 py-8">
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-slate-800 shadow-2xl space-y-6">
            <span className="text-[11px] font-bold text-[#EA3829] tracking-widest uppercase block flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#EA3829]" />
              <span>FISH ROUNDABOUT • AL RIGGA • DEIRA • DUBAI</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              SKYHUB DUBAI – Mobile & Camera Shop in Al Rigga, Deira
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              SKYHUB DUBAI is conveniently located near Fish Roundabout in Al Rigga, Deira, Dubai, United Arab Emirates. Visit our showroom for live device testing, original smartphone sales, fast repairs, camera accessories, and expert technical support.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOTILCAEQABgKGAsYgAQyEQgCEC4YChgLGK8BGMcBGIAEMhEIAxAuGAoYCxivARjHARiABDIRCAQQLhgKGAsYrwEYxwEYgAQyCwgFEAAYChgLGIAEMgsIBhAAGAoYCxiABDILCAcQABgKGAsYgAQyEQgIEC4YChgLGK8BGMcBGIAEMgsICRAAGAoYCxiABNIBCTQ0MjlqMGoxNagCCLACAfEF9RSlZbfsCAnxBfUUpWW37AgJ&um=1&ie=UTF-8&fb=1&gl=ae&sa=X&geocode=KXW641OVQ18-MYkYCToW81qZ&daddr=fish+round+boat+-+Fish+Roundabout+-+Al+Rigga+-+Deira+-+Dubai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions on Google Maps</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0 brightness-0 invert" />
                <span>WhatsApp Store Manager</span>
              </a>
            </div>
          </div>
        </section>

        {/* SHOWROOM DETAILS & GOOGLE MAPS EMBED */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <BranchesSection />
        </section>

        {/* SERVICE QUICK NAVIGATION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">Services Available at Deira Store</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
              <Link href="/services/mobile-phones" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Mobile Phone Sales</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/mobile-phone-repair" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Phone Repair</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/camera-repair" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Camera Repair</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/data-recovery" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Data Recovery</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
