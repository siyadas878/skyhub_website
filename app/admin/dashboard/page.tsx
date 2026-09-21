'use client';

import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ConditionBadge } from '@/components/products/ConditionBadge';
import { formatAED } from '@/lib/utils/currency';
import { useStore } from '@/lib/supabase/store-context';
import {
  Package,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Plus,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  FolderTree,
  Tag,
  Settings
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { products, inquiries } = useStore();

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.is_available).length;
  const soldProducts = products.filter((p) => !p.is_available).length;
  const newProductsCount = products.filter((p) => p.condition === 'New').length;
  const usedProductsCount = products.filter((p) => p.condition === 'Used' || p.condition === 'Refurbished').length;

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dashboard <span className="gradient-text-sky">Overview</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Welcome back, Admin. Real-time store inventory & WhatsApp leads status.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="gradient-bg-sky hover:opacity-90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-5 border border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Products</span>
              <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{totalProducts}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="text-sky-400 font-semibold">{newProductsCount} New</span> • <span>{usedProductsCount} Used</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Available Stock</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">{availableProducts}</div>
            <span className="text-[11px] text-emerald-400 font-medium">Ready for immediate sale</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Sold Devices</span>
              <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-red-400">{soldProducts}</div>
            <span className="text-[11px] text-slate-400">Marked as SOLD out</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Customer Leads</span>
              <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{inquiries.length}</div>
            <span className="text-[11px] text-sky-400 font-medium">WhatsApp & Call logs</span>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="glass-card glass-card-hover rounded-xl p-4 flex items-center space-x-3 border border-sky-900/30"
          >
            <Plus className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold text-white">Add Product</span>
          </Link>
          <Link
            href="/admin/categories"
            className="glass-card glass-card-hover rounded-xl p-4 flex items-center space-x-3 border border-sky-900/30"
          >
            <FolderTree className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold text-white">Categories</span>
          </Link>
          <Link
            href="/admin/brands"
            className="glass-card glass-card-hover rounded-xl p-4 flex items-center space-x-3 border border-sky-900/30"
          >
            <Tag className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold text-white">Brands</span>
          </Link>
          <Link
            href="/admin/settings"
            className="glass-card glass-card-hover rounded-xl p-4 flex items-center space-x-3 border border-sky-900/30"
          >
            <Settings className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold text-white">Store Settings</span>
          </Link>
        </div>

        {/* Recent Product Inventory Table */}
        <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
          <div className="flex items-center justify-between border-b border-sky-950 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Product Inventory</h3>
              <p className="text-xs text-slate-400">Real-time status of items in the store</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sky-950 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-2 font-semibold">Product Name</th>
                  <th className="pb-3 px-2 font-semibold">Condition</th>
                  <th className="pb-3 px-2 font-semibold">Price</th>
                  <th className="pb-3 px-2 font-semibold">Status</th>
                  <th className="pb-3 px-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950/60">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-sky-950/30">
                    <td className="py-3 px-2">
                      <div className="font-bold text-white max-w-xs truncate">{product.name}</div>
                      <div className="text-[10px] text-slate-400">{product.brand?.name}</div>
                    </td>
                    <td className="py-3 px-2">
                      <ConditionBadge condition={product.condition} conditionGrade={product.condition_grade} isAvailable={product.is_available} />
                    </td>
                    <td className="py-3 px-2 font-bold text-white">
                      {formatAED(product.price)}
                    </td>
                    <td className="py-3 px-2">
                      {product.is_available ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          Available
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                          SOLD OUT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-sky-400 hover:underline mr-3"
                      >
                        View Page
                      </Link>
                      <Link
                        href={`/admin/products/new?id=${product.id}`}
                        className="text-xs font-semibold text-slate-300 hover:text-white"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
