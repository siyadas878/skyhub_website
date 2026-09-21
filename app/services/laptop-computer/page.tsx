import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Laptop, Wrench, ArrowRight } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';

export const metadata: Metadata = {
  title: 'Laptop & Computer Repair Service in Dubai | SKYHUB DUBAI',
  description:
    'Expert laptop repair, MacBook motherboard service, screen replacement, and computer service in Al Rigga, Deira, Dubai at SKYHUB DUBAI.',
  keywords: [
    'Laptop repair Dubai',
    'Computer repair Dubai',
    'Laptop service Dubai',
    'MacBook repair Deira',
    'Computer repair service Dubai',
    'SKYHUB DUBAI'
  ],
};

export default function LaptopComputerPage() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const phone = getPhoneNumber();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Laptop & Computer Repair Service in Dubai',
    provider: {
      '@type': 'LocalBusiness',
      name: 'SKYHUB DUBAI',
      address: 'Fish Roundabout, Al Rigga, Deira, Dubai, UAE',
      telephone: '+971523361092',
    },
    areaServed: 'Dubai, UAE',
    description: 'Professional Apple MacBook repair, Windows laptop service, screen replacement, RAM/SSD upgrades, and motherboard logic board repair in Al Rigga, Deira, Dubai.',
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
            <span className="text-[11px] font-bold text-[#EA3829] tracking-widest uppercase block">
              • LAPTOP & COMPUTER REPAIR CENTRE DEIRA
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Laptop & Computer Repair Service in Dubai
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              MacBook not turning on, cracked Retina display, slow performance, or liquid damage? SKYHUB DUBAI provides fast diagnostic and hardware repair for Apple MacBooks, Dell, HP, Lenovo & gaming laptops in Al Rigga, Deira.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0 brightness-0 invert" />
                <span>Chat with Laptop Technician</span>
              </a>
              <Link
                href="/laptops"
                className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Browse Workstations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Computer & Laptop Repair Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'MacBook Logic Board & Screen',
                desc: 'Component-level micro-soldering, power IC replacement, M1/M2/M3 logic board restoration, and original Retina screen replacements.'
              },
              {
                title: 'Battery & Keyboard Replacement',
                desc: 'Replacing worn batteries, unresponsive trackpads, liquid damaged keyboards, and cooling fan thermal paste servicing.'
              },
              {
                title: 'NVMe SSD & High-Speed RAM Upgrades',
                desc: 'Upgrade slow laptops with high-speed Gen4 NVMe SSDs and high-capacity RAM for seamless video editing and multitasking.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <Laptop className="w-8 h-8 text-[#EA3829]" />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">Explore Additional Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
              <Link href="/services/data-recovery" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Data Recovery Service</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/mobile-phones" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Mobile Phones Shop</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/camera" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Camera Shop Dubai</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/location" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Fish Roundabout Location</span>
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
