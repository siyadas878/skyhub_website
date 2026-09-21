import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Phone, ShieldCheck, CheckCircle2, ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';

export const metadata: Metadata = {
  title: 'Mobile Phone Shop in Dubai | Sales & Services | SKYHUB DUBAI',
  description:
    'SKYHUB DUBAI is your premier mobile phone shop in Al Rigga, Deira, Dubai. We sell brand new & certified pre-owned iPhones, Samsung Galaxy, and offer mobile phone repair services.',
  keywords: [
    'Mobile phone shop in Dubai',
    'Mobile phone shop in Deira',
    'Mobile phone shop in Al Rigga',
    'Mobile phone sales Dubai',
    'Used iPhone Dubai',
    'Samsung Galaxy Ultra Dubai',
    'SKYHUB DUBAI'
  ],
};

export default function MobilePhonesServicePage() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const phone = getPhoneNumber();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Mobile Phone Sales & Services in Dubai',
    provider: {
      '@type': 'LocalBusiness',
      name: 'SKYHUB DUBAI',
      address: 'Fish Roundabout, Al Rigga, Deira, Dubai, UAE',
      telephone: '+971523361092',
    },
    areaServed: 'Dubai, UAE',
    description: 'Brand new and certified pre-owned smartphone sales, trade-ins, battery replacements, and mobile repair services in Al Rigga, Deira, Dubai.',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 space-y-16 py-8">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-slate-800 shadow-2xl space-y-6">
            <span className="text-[11px] font-bold text-[#EA3829] tracking-widest uppercase block">
              • AL RIGGA, DEIRA, DUBAI
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Mobile Phone Shop & Smartphone Sales in Dubai
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Looking for a trusted mobile phone shop in Deira, Dubai? SKYHUB DUBAI offers brand new sealed smartphones, 35-point tested pre-owned iPhones and Samsung Galaxy devices with guaranteed battery health, warranty, and instant store pickup near Fish Roundabout.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0 brightness-0 invert" />
                <span>Inquire on WhatsApp</span>
              </a>
              <Link
                href="/mobiles"
                className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Browse Phone Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES OFFERED GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block">
              • WHAT WE OFFER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Mobile Phone Sales & Service Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Brand New Sealed Phones',
                desc: 'Official regional & international specs for iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, Google Pixel & flagship foldables with manufacturer warranty.'
              },
              {
                title: 'Grade A+ Certified Pre-Owned',
                desc: 'Thoroughly tested 35-point inspection pre-owned phones with 90%+ battery health guarantee, zero hidden faults, and store warranty.'
              },
              {
                title: 'Trade-In & Instant Cash',
                desc: 'Bring your current device to our Al Rigga Deira showroom for instant trade-in valuation and upgrade to the latest model in minutes.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <ShieldCheck className="w-8 h-8 text-[#EA3829]" />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKS TO OTHER SERVICES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">Explore Additional SKYHUB DUBAI Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
              <Link href="/services/mobile-phone-repair" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Mobile Repair Service</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/services/camera" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Camera Shop Dubai</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/services/laptop-computer" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Laptop & Mac Repair</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/location" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Deira Store Location</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
