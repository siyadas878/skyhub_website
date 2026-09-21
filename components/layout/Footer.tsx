'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, MessageCircle, Navigation, ShieldCheck } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';
import { IconInstagram, IconFacebook, IconWhatsApp, IconTikTok, IconYouTube, IconX, IconLinkedIn } from '@/components/icons/SocialIcons';

export function Footer() {
  const phone = getPhoneNumber();
  const whatsappUrl = generateGeneralWhatsAppLink();

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/sky_hub_official/', icon: IconInstagram, color: 'hover:bg-pink-600' },
    { name: 'Facebook', href: 'https://www.facebook.com/p/skysbuy-100054198354444', icon: IconFacebook, color: 'hover:bg-blue-600' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@skyhubmobi', icon: IconTikTok, color: 'hover:bg-slate-900' },
    { name: 'WhatsApp', href: whatsappUrl, icon: IconWhatsApp, color: 'hover:bg-emerald-600' },
  ];


  return (
    <footer className="bg-[#EA3829] text-white pt-14 pb-28 sm:pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Footer 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-red-400/40">
          
          {/* Column 1: Categories */}
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider mb-4 border-b-2 border-white/20 pb-2 inline-block">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-red-100 font-semibold">
              <li><Link href="/mobiles" className="hover:text-white transition-colors">Mobile Phones (iPhones & Samsung)</Link></li>
              <li><Link href="/laptops" className="hover:text-white transition-colors">Laptops (MacBooks & Windows)</Link></li>
              <li><Link href="/accessories" className="hover:text-white transition-colors">Accessories (Chargers, Drones & Audio)</Link></li>
              <li><Link href="/mobiles?condition=Used" className="hover:text-white transition-colors">Pre-Owned Quality Certified</Link></li>
            </ul>
          </div>

          {/* Column 2: Business Services & Categories (Linked for SEO) */}
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider mb-4 border-b-2 border-white/20 pb-2 inline-block">
              Our Services
            </h3>
            <ul className="space-y-2 text-xs text-red-100 font-medium">
              <li>
                <Link href="/services/mobile-phones" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Mobile Phone Sales & Service</span>
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-phone-repair" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Phone Repair Service</span>
                </Link>
              </li>
              <li>
                <Link href="/services/laptop-computer" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Laptop & Computer Services</span>
                </Link>
              </li>
              <li>
                <Link href="/services/camera-repair" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Camera & Video Repair</span>
                </Link>
              </li>
              <li>
                <Link href="/services/data-recovery" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Data Recovery Service</span>
                </Link>
              </li>
              <li>
                <Link href="/services/broadcasting-media" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Broadcasting & Media</span>
                </Link>
              </li>
              <li>
                <Link href="/services/audio-visual" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Audio-Visual Equipment</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Flagship Store Info & Logo */}
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider mb-4 border-b-2 border-white/20 pb-2 inline-block">
              Deira Store
            </h3>
            <div className="space-y-3 text-xs text-red-100">
              <div className="relative h-11 w-40 mb-3 bg-[#111111] rounded-xl p-2 border border-slate-800 shadow-md">
                <Image
                  src="/sky_hub_logo.png"
                  alt="SKYHUB DUBAI Logo"
                  fill
                  className="object-contain p-1"
                  sizes="160px"
                />
              </div>
              <p className="font-extrabold text-white text-sm">SKYHUB DUBAI</p>
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Fish Roundabout, Al Rigga, Deira, Dubai, UAE</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>{phone.startsWith('+') ? phone : `+${phone}`}</span>
              </p>
            </div>
          </div>

          {/* Column 4: Follow Us & Social Media Links */}
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider mb-4 border-b-2 border-white/20 pb-2 inline-block">
              Follow & Connect
            </h3>
            <p className="text-xs text-red-100 mb-4">
              Stay updated with daily arrivals, mobile & camera services, and WhatsApp support.
            </p>

            {/* Social Media Link Icons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-xl bg-black/30 text-white flex items-center justify-center transition-all ${soc.color} hover:scale-110 shadow-sm`}
                  title={soc.name}
                >
                  <soc.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-105"
            >
              <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 shrink-0" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-3 text-xs text-red-200">
          <p>© {new Date().getFullYear()} SKYHUB DUBAI. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center space-x-4 font-semibold">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white">Contact & Location</Link>
          </div>
        </div>
      </div>

      {/* Floating Animated WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-600/50 transition-all duration-300 hover:scale-110 group border-2 border-white/40"
        title="Chat live with SKYHUB DUBAI on WhatsApp"
      >
        {/* Pulsing online status indicator dot */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white"></span>
        </span>

        <img src="/whatsapp.svg" alt="WhatsApp" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
      </a>
    </footer>
  );
}

