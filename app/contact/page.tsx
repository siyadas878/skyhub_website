'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BranchesSection } from '@/components/sections/BranchesSection';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneNumber, getWhatsAppNumber } from '@/lib/utils/whatsapp';
import { IconInstagram, IconFacebook, IconWhatsApp, IconTikTok, IconYouTube, IconX, IconLinkedIn } from '@/components/icons/SocialIcons';

export default function ContactPage() {
  const phone = getPhoneNumber();
  const whatsappNum = getWhatsAppNumber();
  const whatsappUrl = generateGeneralWhatsAppLink();

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/sky_hub_official/', icon: IconInstagram, color: 'bg-pink-600 hover:bg-pink-700' },
    { name: 'Facebook', href: 'https://www.facebook.com/p/skysbuy-100054198354444', icon: IconFacebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@skyhubmobi', icon: IconTikTok, color: 'bg-slate-900 hover:bg-slate-800' },
    { name: 'WhatsApp', href: whatsappUrl, icon: IconWhatsApp, color: 'bg-emerald-600 hover:bg-emerald-700' },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900">
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
                      <span className="text-xs text-slate-600 font-medium">info@skyhubdubai.com</span>
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

            {/* Right Column: Direct Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                    • FAST INQUIRY
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">Send Us a Direct Message</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Looking for a specific device or trade-in estimate? Fill out the form below.
                  </p>
                </div>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-lg font-bold text-slate-900">Inquiry Received!</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Thank you for contacting SkyHub Media UAE. Our store staff will review your request and get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-[#EA3829] hover:underline font-bold pt-2 block mx-auto"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ahmed Al Mansoori"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Phone / Mobile Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+971 50 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Your Inquiry Message</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us which mobile phone, laptop model or accessory you are looking for..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-102"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to SkyHub</span>
                    </button>
                  </form>
                )}
              </div>
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

