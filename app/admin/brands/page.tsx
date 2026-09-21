'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useStore } from '@/lib/supabase/store-context';
import { Plus, Tag, Trash2 } from 'lucide-react';

export default function AdminBrandsPage() {
  const { brands, addBrand, deleteBrand } = useStore();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await addBrand({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      });
      setName('');
      setSlug('');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this brand? Changes will reflect live across the website.')) {
      await deleteBrand(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Brands <span className="gradient-text-sky">Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage manufacturer brands (Apple, Samsung, Dell, Sony, DJI, Anker).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add New Brand</span>
              </h3>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hollyland"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Brand Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. hollyland"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gradient-bg-sky hover:opacity-90 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Brand</span>
                </button>
              </form>
            </div>
          </div>

          {/* Brands List (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-400" />
                <span>Configured Brands</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand) => (
                  <div key={brand.id} className="bg-[#070C1B] rounded-xl p-4 flex items-center justify-between border border-sky-950">
                    <div>
                      <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                      <span className="text-[10px] text-sky-400 font-mono">/{brand.slug}</span>
                    </div>

                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
