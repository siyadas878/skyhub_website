import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Camera, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';

export const metadata: Metadata = {
  title: 'Camera Repair Service in Dubai | SKYHUB DUBAI',
  description:
    'Professional camera repair service in Dubai. Expert video camera servicing, lens calibration, sensor cleaning, shutter repair, and motherboard fix at SKYHUB DUBAI in Al Rigga, Deira.',
  keywords: [
    'Camera repair Dubai',
    'Professional camera repair Dubai',
    'Video camera repair Dubai',
    'Lens repair Dubai',
    'Sony camera repair Dubai',
    'SKYHUB DUBAI'
  ],
};

export default function CameraRepairPage() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const phone = getPhoneNumber();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Camera & Video Camera Repair Service in Dubai',
    provider: {
      '@type': 'LocalBusiness',
      name: 'SKYHUB DUBAI',
      address: 'Fish Roundabout, Al Rigga, Deira, Dubai, UAE',
      telephone: '+971523361092',
    },
    areaServed: 'Dubai, UAE',
    description: 'Expert DSLR, mirrorless, video camera, and cinema lens repair, sensor cleaning, autofocus calibration, and shutter replacement in Al Rigga, Deira, Dubai.',
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
              • SPECIALIZED CAMERA TECHNICIANS IN DEIRA
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Professional Camera Repair Service in Dubai
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Camera error, stuck shutter, lens fungus, or damaged HDMI port? SKYHUB DUBAI specializes in video camera repair, DSLR servicing, sensor cleaning, lens element replacement, and board-level repairs in Al Rigga, Deira, Dubai.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0 brightness-0 invert" />
                <span>Consult Technician via WhatsApp</span>
              </a>
              <a
                href={`tel:${phone}`}
                className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Call Store: {phone}</span>
              </a>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Camera & Video Repair Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Sensor Cleaning & Calibration',
                desc: 'Precision wet & dry CMOS sensor dust removal, hot pixel remapping, and focus optical alignment for Sony, Canon, Nikon & RED.'
              },
              {
                title: 'Lens Mechanism & Aperture Repair',
                desc: 'Fixing jammed zoom rings, autofocus motor (USM/Linear) replacements, aperture blade unsticking, and optical element cleaning.'
              },
              {
                title: 'Shutter & Port Motherboard Fix',
                desc: 'Shutter box replacement, broken HDMI/SD slot repair, liquid spill restoration, and power delivery board fixes.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <Wrench className="w-8 h-8 text-[#EA3829]" />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">Explore Related Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
              <Link href="/services/camera" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Camera Gear Shop</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/broadcasting-media" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Broadcasting Equipment</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/data-recovery" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Memory Card Data Recovery</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/location" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Deira Showroom</span>
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
