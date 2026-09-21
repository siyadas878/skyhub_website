'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  MessageSquare,
  Settings,
  LayoutTemplate,
  LogOut,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products Catalog', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Brands', href: '/admin/brands', icon: Tag },
    { name: 'Homepage Content', href: '/admin/homepage', icon: LayoutTemplate },
    { name: 'Inquiries Log', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#070C1D] border-r border-sky-900/30 min-h-screen p-6 flex flex-col justify-between hidden md:flex">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="space-y-1">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-bg-sky flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              SKYHUB <span className="gradient-text-sky">ADMIN</span>
            </span>
          </Link>
          <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase block pl-10">
            Manager Control
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'text-slate-300 hover:bg-sky-950/60 hover:text-sky-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Links */}
      <div className="space-y-3 pt-6 border-t border-sky-950">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-sky-950/40"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
