'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Clock, Navigation, MessageCircle, Building2, CheckCircle2 } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  mapUrl: string;
  isFlagship?: boolean;
}

import { useStore } from '@/lib/supabase/store-context';

export function BranchesSection() {
  const { storeSettings } = useStore();
  const whatsappUrl = generateGeneralWhatsAppLink();

  const branches: Branch[] = [
    {
      id: storeSettings.id || 'fish-roundabout',
      name: `${storeSettings.store_name} (Main Store & Service Center)`,
      city: 'Dubai',
      address: storeSettings.address || 'Fish Roundabout, Al Rigga, Deira, Dubai, United Arab Emirates',
      phone: storeSettings.phone || '+971 52 336 1092',
      hours: storeSettings.opening_hours || 'Sat - Thu: 10:00 AM - 10:00 PM | Fri: 4:00 PM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
      mapUrl: storeSettings.google_maps_url || 'https://maps.google.com',
      isFlagship: true,
    }
  ];

  return (
    <section className="space-y-8">
      {/* Header Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block">
          • OUR SHOWROOM LOCATIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Visit {storeSettings.store_name || 'SKYHUB DUBAI'} Showrooms
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Walk into our official store in Deira Dubai for live device testing, battery health checks, instant store pickup, and pro technician support.
        </p>
      </div>

      {/* Grid of Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Store Image */}
            <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
              <Image
                src={branch.image}
                alt={branch.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Flagship Badge */}
              {branch.isFlagship && (
                <span className="absolute top-3 left-3 bg-[#EA3829] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  FLAGSHIP STORE
                </span>
              )}

              {/* City Pill Tag */}
              <span className="absolute top-3 right-3 bg-[#0B0F19]/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur">
                {branch.city}
              </span>
            </div>

            {/* Content Info Area */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#EA3829] shrink-0" />
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#EA3829] transition-colors leading-snug">
                    {branch.name}
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <p className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-[#EA3829] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <a href={`tel:${branch.phone}`} className="font-bold text-slate-900 hover:text-[#EA3829]">
                      {branch.phone}
                    </a>
                  </p>
                  <p className="flex items-center space-x-2 text-slate-500">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{branch.hours}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Get Directions & WhatsApp Support */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-[#EA3829] text-white font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                  <span>WhatsApp Branch</span>
                </a>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
