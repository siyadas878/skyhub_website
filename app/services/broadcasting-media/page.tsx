import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Radio, Video, ArrowRight } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';

import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Broadcasting & Media Solutions in Dubai',
  description:
    'Broadcasting equipment, live stream video gear, SDI/HDMI switchers, wireless transmitters, and pro studio media solutions in Dubai at SKYHUB DUBAI.',
  alternates: {
    canonical: `${siteUrl}/services/broadcasting-media`,
  },
  keywords: [
    'Broadcasting equipment Dubai',
    'Live streaming gear Dubai',
    'Wireless video transmitter Dubai',
    'Media solutions Dubai',
    'SKYHUB DUBAI'
  ],
};

export default function BroadcastingMediaPage() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const phone = getPhoneNumber();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Broadcasting & Media Solutions in Dubai',
    provider: {
      '@type': 'LocalBusiness',
      name: 'SKYHUB DUBAI',
      address: 'Fish Roundabout, Al Rigga, Deira, Dubai, UAE',
      telephone: '+971523361092',
    },
    areaServed: 'Dubai, UAE',
    description: 'Professional live streaming hardware, video switchers, wireless video transmission (Hollyland/Teradek), and broadcast studio setups in Al Rigga, Deira, Dubai.',
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
              • BROADCAST & STUDIO GEAR DUBAI
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Broadcasting & Media Solutions in Dubai
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              SKYHUB DUBAI supplies professional broadcast equipment, multi-camera live stream switchers, wireless video transmission systems, and media production hardware to studios and content creators across Dubai & UAE.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0 brightness-0 invert" />
                <span>Consult Broadcast Expert</span>
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
              Broadcast Hardware & Media Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Live Stream Switchers',
                desc: 'Blackmagic ATEM Mini Pro, YoloBox Ultra 4K, and multi-channel SDI/HDMI live production switchers.'
              },
              {
                title: 'Wireless Video Transmitters',
                desc: 'Hollyland Mars 400S Pro, Cosmo C1, and zero-latency wireless HDMI/SDI video monitoring systems.'
              },
              {
                title: 'Studio Setup & Media Gear',
                desc: 'Teleprompters, field monitors, studio intercom headsets, motorized PTZ cameras, and capture cards.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <Radio className="w-8 h-8 text-[#EA3829]" />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">Related SKYHUB DUBAI Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
              <Link href="/services/audio-visual" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Audio-Visual Equipment</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/camera" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Camera Shop</span>
                <ArrowRight className="w-4 h-4 text-[#EA3829]" />
              </Link>
              <Link href="/services/camera-repair" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between group">
                <span>Camera Repair</span>
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
