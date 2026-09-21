'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ConditionBadge } from '@/components/products/ConditionBadge';
import { formatAED } from '@/lib/utils/currency';
import { useStore } from '@/lib/supabase/store-context';
import { Plus, Search, Trash2, Edit3, ExternalLink, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function AdminProductsPage() {
  const { products, toggleAvailability, deleteProduct, refreshData, loading } = useStore();
  const [search, setSearch] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');

  const filteredProducts = products.filter((p) => {
    if (conditionFilter !== 'all' && p.condition !== conditionFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product from inventory? Changes will reflect live across the website.')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Products <span className="gradient-text-sky">Inventory</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your new, used, and refurbished inventory catalog.
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

        {/* Filter & Search Bar */}
        <div className="glass-card rounded-2xl p-4 border border-sky-900/40 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-sky-900/50 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Condition:</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50 focus:outline-none focus:border-sky-400 font-semibold"
            >
              <option value="all">All Conditions</option>
              <option value="New">Brand New</option>
              <option value="Used">Used / Pre-Owned</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>
        </div>

        {/* Inventory List Table */}
        <div className="glass-card rounded-2xl p-6 border border-sky-800/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sky-950 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 font-semibold">Product</th>
                  <th className="pb-3 px-3 font-semibold">Condition</th>
                  <th className="pb-3 px-3 font-semibold">Price</th>
                  <th className="pb-3 px-3 font-semibold">Stock & Availability</th>
                  <th className="pb-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950/60">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-sky-950/30">
                    <td className="py-4 px-3">
                      <div className="font-bold text-white max-w-sm truncate">{product.name}</div>
                      <div className="text-[10px] text-slate-400">{product.brand?.name} • SKU: {product.sku || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-3">
                      <ConditionBadge condition={product.condition} conditionGrade={product.condition_grade} isAvailable={product.is_available} />
                    </td>
                    <td className="py-4 px-3 font-bold text-white">
                      {formatAED(product.price)}
                    </td>
                    <td className="py-4 px-3">
                      <button
                        onClick={() => toggleAvailability(product.id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 w-fit ${
                          product.is_available
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900'
                            : 'bg-red-950/80 text-red-300 border-red-700/60 hover:bg-red-900'
                        }`}
                      >
                        {product.is_available ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{product.is_available ? 'Available' : 'SOLD OUT'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="text-sky-400 hover:text-sky-300 p-1"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/new?id=${product.id}`}
                          className="text-slate-300 hover:text-white p-1"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
