import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BranchesSection } from '@/components/sections/BranchesSection';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapPin, Phone, MessageCircle, Mail, Clock } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber, getWhatsAppNumber } from '@/lib/utils/whatsapp';
import { IconInstagram, IconFacebook, IconWhatsApp, IconTikTok } from '@/components/icons/SocialIcons';
import { getSiteUrl } from '@/lib/utils/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Contact & Location | SKYHUB DUBAI Al Rigga Deira',
  description: 'Contact SKYHUB DUBAI in Al Rigga, Deira, Dubai. Call +971 52 336 1092, WhatsApp us, or visit our store for mobile phones, cameras, laptops & repairs.',
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact & Location | SKYHUB DUBAI',
    description: 'Contact SKYHUB DUBAI in Al Rigga, Deira, Dubai. Phone: +971 52 336 1092',
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  const phone = getPhoneNumber();
  const whatsappNum = getWhatsAppNumber();
  const whatsappUrl = generateGeneralWhatsAppLink();

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/sky_hub_official/', icon: IconInstagram, color: 'bg-pink-600 hover:bg-pink-700' },
    { name: 'Facebook', href: 'https://www.facebook.com/p/skysbuy-100054198354444', icon: IconFacebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@skyhubmobi', icon: IconTikTok, color: 'bg-slate-900 hover:bg-slate-800' },
    { name: 'WhatsApp', href: whatsappUrl, icon: IconWhatsApp, color: 'bg-emerald-600 hover:bg-emerald-700' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block">
              • GET IN TOUCH
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
              Contact <span className="text-[#EA3829]">SKYHUB DUBAI</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              We do all kind of Mobile phone sales and service, Laptop services, Photography video Camera accessories, Broadcasting and media solutions.
            </p>
          </div>

          {/* Contact Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left Column: Contact Cards & Socials */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">

                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Direct Store Channels
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EA3829] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase">Store Location</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Fish Roundabout, Al Rigga, Deira, Dubai, United Arab Emirates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EA3829] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase">Store Telephone</h4>
                      <a href={`tel:${phone}`} className="text-xs font-bold text-[#EA3829] hover:underline">
                        +{phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase">WhatsApp Instant Support</h4>
                      <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 hover:underline">
                        +{whatsappNum}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase">Official Email</h4>
                      <span className="text-xs text-slate-600 font-medium">info@skyhubmobi.com</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 pt-2 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase">Opening Hours</h4>
                      <p className="text-xs text-slate-600 font-medium">Sat - Thu: 10:00 AM - 10:00 PM</p>
                      <p className="text-xs text-slate-400">Fri: 4:00 PM - 10:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links Section */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Follow SkyHub on Social Media
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((soc) => (
                      <a
                        key={soc.name}
                        href={soc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-white p-2.5 rounded-xl transition-all shadow-sm ${soc.color} hover:scale-105 flex items-center space-x-1.5 text-xs font-bold`}
                        title={soc.name}
                      >
                        <soc.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{soc.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Accessible Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>

          {/* Showroom Branches Grid Section */}
          <div className="pt-8 border-t border-slate-200/80">
            <BranchesSection />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}


