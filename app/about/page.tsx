'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BranchesSection } from '@/components/sections/BranchesSection';
import { Sparkles, ShieldCheck, Award, MapPin, MessageCircle, Phone } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';

export default function AboutPage() {
  const phone = getPhoneNumber();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-16">
          
          {/* Hero */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block">
              • ESTABLISHED EXCELLENCE IN UAE
            </span>
            <h1 className="text-4xl font-black text-slate-900">
              About <span className="text-[#EA3829]">SkyHub Media UAE</span>
            </h1>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              SkyHub Media is UAE’s trusted destination for authentic new, pre-owned & refurbished smartphones, high-performance MacBooks, and official tech accessories.
            </p>
          </div>

          {/* Grid Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 space-y-3 border border-slate-200/80 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#EA3829]" />
              <h3 className="text-base font-bold text-slate-900">Certified Used Hardware</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every pre-owned phone or laptop is benchmarked across 35 hardware checks—ensuring battery health, display clarity, camera sensors, and original serial validation.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 space-y-3 border border-slate-200/80 shadow-sm">
              <Award className="w-8 h-8 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-900">No Hidden Defects</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe in 100% transparency. Every used device listing clearly displays the exact battery health percentage, physical condition grade, and real device photos.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 space-y-3 border border-slate-200/80 shadow-sm">
              <MapPin className="w-8 h-8 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Physical Showrooms</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unlike online-only vendors, our physical showrooms across Dubai, Abu Dhabi, and Sharjah allow customers to inspect devices, test hardware, and purchase in person.
              </p>
            </div>
          </div>

          {/* Showroom Branches Section */}
          <div className="pt-6 border-t border-slate-200/80">
            <BranchesSection />
          </div>

          {/* CTA Box */}
          <div className="bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-10 text-center space-y-6 border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-black text-white">Looking for a Specific Smartphone or Laptop Model?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Our sales inventory updates daily across all branches. Send us a message on WhatsApp or call our store staff to check availability and request instant pictures.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3.5 px-6 rounded-full inline-flex items-center space-x-2 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:${phone}`}
                className="bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs py-3.5 px-6 rounded-full inline-flex items-center space-x-2 transition-transform hover:scale-105"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Call Store: +{phone}</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

