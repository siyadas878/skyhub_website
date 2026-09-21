'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Smartphone, Laptop, Headphones, Shield, Search, PhoneCall, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/supabase/store-context';
import { formatAED } from '@/lib/utils/currency';

export function Navbar() {
  const { products } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'Mobiles', href: '/mobiles', icon: Smartphone },
    { name: 'Laptops', href: '/laptops', icon: Laptop },
    { name: 'Accessories', href: '/accessories', icon: Headphones },
  ];

  // Search Results preview dropdown from live dynamic store
  const searchResults = searchQuery.trim().length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/mobiles?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo (Left) */}
        <Link href="/" className="flex items-center shrink-0 group">
          <div className="relative h-9 w-32 sm:h-11 sm:w-44">
            <Image
              src="/sky_hub_logo.png"
              alt="SkyHub Media Logo"
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="176px"
              priority
            />
          </div>
        </Link>

        {/* Navigation Category Links (Center-Left) */}
        <nav className="hidden lg:flex items-center space-x-1">
          <Link
            href="/"
            className={`text-xs font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all ${
              pathname === '/' ? 'text-[#EA3829] bg-slate-900/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>

          {categories.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'text-white bg-[#EA3829] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <cat.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Search Bar with Realtime Dropdown (Center-Right) */}
        <div ref={searchRef} className="relative flex-1 max-w-[180px] sm:max-w-sm lg:max-w-md mx-1 sm:mx-2">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              className="w-full bg-[#161F32] border border-slate-700/80 text-white placeholder-slate-400 text-xs rounded-full pl-8 pr-7 sm:pl-9 sm:pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-[#EA3829] focus:border-transparent transition-all shadow-inner truncate"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Real-time Search Suggestions Popover */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0B0F19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 bg-slate-900/60 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                <span>Matching Devices ({searchResults.length})</span>
                <span className="text-[#EA3829]">Press Enter for full results</span>
              </div>
              {searchResults.map((item) => {
                const img = item.images && item.images.length > 0 ? item.images[0].image_url : '/sky_hub_logo.png';
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    onClick={() => setIsSearchFocused(false)}
                    className="flex items-center space-x-3 p-3 hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="relative w-10 h-10 rounded-lg bg-white/10 p-1 shrink-0 overflow-hidden">
                      <Image src={img} alt={item.name} fill className="object-contain p-1" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#EA3829] transition-colors truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {item.brand?.name || 'Electronics'}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-[#EA3829] shrink-0">
                      {formatAED(item.price)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right CTA Actions: Contact Us & Mobile Menu Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/contact"
            className="hidden sm:flex items-center space-x-2 bg-[#EA3829] hover:bg-[#D32F2F] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-transform hover:scale-105 shadow-md"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F19] text-white border-t border-slate-800 p-5 space-y-4 animate-in slide-in-from-top-4">
          
          <div className="grid grid-cols-1 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#141A29] hover:bg-[#EA3829] text-slate-200 hover:text-white p-3.5 rounded-xl text-xs font-bold transition-colors"
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#141A29] hover:bg-[#EA3829] text-slate-200 hover:text-white p-3.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <cat.icon className="w-4 h-4 text-[#EA3829] group-hover:text-white" />
                  <span>{cat.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Us</span>
            </Link>
          </div>

        </div>
      )}
    </header>
  );
}
