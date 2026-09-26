'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useStore } from '@/lib/supabase/store-context';
import { Save, Sparkles, Upload, Loader2, Image as ImageIcon, Star, Layers, Flame, PackageCheck, Plus, Trash2, MessageSquare } from 'lucide-react';
import { CustomerReview } from '@/types';

export default function AdminHomepageManager() {
  const { homepageSettings, updateHomepageSettings, products } = useStore();
  const [form, setForm] = useState(homepageSettings);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'featured' | 'banners' | 'deals' | 'reviews'>('hero');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingFieldRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (homepageSettings && homepageSettings.hero_title && !isInitializedRef.current) {
      setForm(homepageSettings);
      isInitializedRef.current = true;
    }
  }, [homepageSettings]);

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecondaryProductChange = (index: number, productId: string) => {
    const updated = [...(form.secondary_featured_product_ids || [])];
    updated[index] = productId;
    handleChange('secondary_featured_product_ids', updated);
  };

  const handleDealsProductChange = (index: number, productId: string) => {
    const updated = [...(form.deals_product_ids || [])];
    updated[index] = productId;
    handleChange('deals_product_ids', updated);
  };

  // Device File Upload handler for banner images
  const triggerFileUpload = (fieldName: string) => {
    uploadingFieldRef.current = fieldName;
    setUploadingField(fieldName);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetField = uploadingFieldRef.current || uploadingField;
    const files = e.target.files;
    if (!files || files.length === 0 || !targetField) return;

    try {
      setUploadingField(targetField);
      const formData = new FormData();
      formData.append('files', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.urls && data.urls[0]) {
        handleChange(targetField as any, data.urls[0]);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      uploadingFieldRef.current = null;
      setUploadingField(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateHomepageSettings(form);
    setSaving(false);
    if (success) {
      alert('Homepage settings & special products updated live on website!');
    } else {
      alert('Failed to update homepage settings. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      {/* Hidden File Input for Device Image Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Homepage Content & Special Products</span>
              <Sparkles className="w-5 h-5 text-sky-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Customize website hero text, showcase banners, and hand-pick featured Bento products live.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="gradient-bg-sky hover:opacity-90 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving Live...' : 'Save Homepage Config'}</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-sky-900/50 space-x-2 overflow-x-auto">
          {[
            { id: 'hero', label: '1. Hero Section', icon: Sparkles },
            { id: 'featured', label: '2. Special Bento Products', icon: Star },
            { id: 'banners', label: '3. Promo Banners', icon: Layers },
            { id: 'deals', label: '4. Great Deals', icon: Flame },
            { id: 'reviews', label: '5. Customer Reviews', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                  active
                    ? 'border-sky-400 text-sky-400 bg-sky-950/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: HERO SECTION BUILDER */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
              Hero Section Banner Customizer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Top Badge Text</label>
                <input
                  type="text"
                  value={form.hero_badge || ''}
                  onChange={(e) => handleChange('hero_badge', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                  placeholder="e.g. • FLAGSHIP TECHNOLOGY • DUBAI"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Main Headline Title</label>
                <input
                  type="text"
                  value={form.hero_title || ''}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 font-bold"
                  placeholder="e.g. Redefining Everyday Tech"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Subtitle Description</label>
              <textarea
                rows={3}
                value={form.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Primary Button Label</label>
                <input
                  type="text"
                  value={form.hero_primary_button_text || ''}
                  onChange={(e) => handleChange('hero_primary_button_text', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Primary Button Link</label>
                <input
                  type="text"
                  value={form.hero_primary_button_url || ''}
                  onChange={(e) => handleChange('hero_primary_button_url', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Secondary Button Label</label>
                <input
                  type="text"
                  value={form.hero_secondary_button_text || ''}
                  onChange={(e) => handleChange('hero_secondary_button_text', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Rating Badge Text</label>
                <input
                  type="text"
                  value={form.hero_rating_text || ''}
                  onChange={(e) => handleChange('hero_rating_text', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Rating Subtext</label>
                <input
                  type="text"
                  value={form.hero_rating_subtext || ''}
                  onChange={(e) => handleChange('hero_rating_subtext', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
              </div>
            </div>

            {/* Hero Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Hero Feature Device Photo</label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={form.hero_image_url || ''}
                  onChange={(e) => handleChange('hero_image_url', e.target.value)}
                  className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                  placeholder="Image URL..."
                />
                <button
                  type="button"
                  onClick={() => triggerFileUpload('hero_image_url')}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Device Photo</span>
                </button>
              </div>

              {form.hero_image_url && (
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#0B0F19] border border-sky-900 mt-2 relative">
                  <img src={form.hero_image_url} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SPECIAL BENTO PRODUCTS PICKER */}
        {/* ========================================================================= */}
        {activeTab === 'featured' && (
          <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                "Best Picks For You" Bento Grid Selector
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Hand-pick which products from your inventory appear in the special Bento Grid on the homepage.
              </p>
            </div>

            {/* Main Left Tall Featured Bento Card Picker */}
            <div className="p-4 bg-[#111C3A] rounded-xl border border-sky-700/50 space-y-3">
              <span className="text-xs font-extrabold text-sky-400 uppercase tracking-widest block">
                1. Main Flagship Product (Left Tall Card)
              </span>
              <select
                value={form.main_featured_product_id || ''}
                onChange={(e) => handleChange('main_featured_product_id', e.target.value)}
                className="w-full bg-[#0A1128] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 font-bold"
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — AED {p.price} ({p.condition})
                  </option>
                ))}
              </select>
            </div>

            {/* 4 Secondary Right Bento Cards Pickers */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-sky-400 uppercase tracking-widest block">
                2. Right Grid Products (Select 4 Products)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="p-3.5 bg-[#0D1630] rounded-xl border border-sky-900/50 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">
                      Grid Product #{idx + 1}
                    </label>
                    <select
                      value={form.secondary_featured_product_ids?.[idx] || ''}
                      onChange={(e) => handleSecondaryProductChange(idx, e.target.value)}
                      className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                    >
                      <option value="">Select product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — AED {p.price}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PROMOTIONAL SHOWCASE BANNERS */}
        {/* ========================================================================= */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Banner 1: Samsung Showcase */}
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                Showcase Banner 1 (Samsung & Foldables)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Badge (e.g. Next-Gen Foldable & Ultra)"
                  value={form.banner1_badge || ''}
                  onChange={(e) => handleChange('banner1_badge', e.target.value)}
                  className="bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
                <input
                  type="text"
                  placeholder="Headline Title"
                  value={form.banner1_title || ''}
                  onChange={(e) => handleChange('banner1_title', e.target.value)}
                  className="bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 font-bold"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Description text..."
                value={form.banner1_subtitle || ''}
                onChange={(e) => handleChange('banner1_subtitle', e.target.value)}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 resize-none"
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Image URL..."
                  value={form.banner1_image_url || ''}
                  onChange={(e) => handleChange('banner1_image_url', e.target.value)}
                  className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
                <button
                  type="button"
                  onClick={() => triggerFileUpload('banner1_image_url')}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>

            {/* Dual Promo Banners (Left & Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side Promo */}
              <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                  Side-by-Side Banner (Left)
                </h3>

                <input
                  type="text"
                  placeholder="Badge"
                  value={form.promo_left_badge || ''}
                  onChange={(e) => handleChange('promo_left_badge', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={form.promo_left_title || ''}
                  onChange={(e) => handleChange('promo_left_title', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 font-bold"
                />
                <textarea
                  rows={2}
                  placeholder="Subtitle..."
                  value={form.promo_left_subtitle || ''}
                  onChange={(e) => handleChange('promo_left_subtitle', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 resize-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={form.promo_left_image_url || ''}
                    onChange={(e) => handleChange('promo_left_image_url', e.target.value)}
                    className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                  />
                  <button
                    type="button"
                    onClick={() => triggerFileUpload('promo_left_image_url')}
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Right Side Promo */}
              <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                  Side-by-Side Banner (Right)
                </h3>

                <input
                  type="text"
                  placeholder="Badge"
                  value={form.promo_right_badge || ''}
                  onChange={(e) => handleChange('promo_right_badge', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={form.promo_right_title || ''}
                  onChange={(e) => handleChange('promo_right_title', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 font-bold"
                />
                <textarea
                  rows={2}
                  placeholder="Subtitle..."
                  value={form.promo_right_subtitle || ''}
                  onChange={(e) => handleChange('promo_right_subtitle', e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 resize-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={form.promo_right_image_url || ''}
                    onChange={(e) => handleChange('promo_right_image_url', e.target.value)}
                    className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                  />
                  <button
                    type="button"
                    onClick={() => triggerFileUpload('promo_right_image_url')}
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {/* Banner 2: Apple Showcase */}
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                Showcase Banner 2 (Apple & Season)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Badge (e.g. Official Apple Showcase)"
                  value={form.banner2_badge || ''}
                  onChange={(e) => handleChange('banner2_badge', e.target.value)}
                  className="bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
                <input
                  type="text"
                  placeholder="Headline Title"
                  value={form.banner2_title || ''}
                  onChange={(e) => handleChange('banner2_title', e.target.value)}
                  className="bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 font-bold"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Description text..."
                value={form.banner2_subtitle || ''}
                onChange={(e) => handleChange('banner2_subtitle', e.target.value)}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 resize-none"
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Image URL..."
                  value={form.banner2_image_url || ''}
                  onChange={(e) => handleChange('banner2_image_url', e.target.value)}
                  className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
                <button
                  type="button"
                  onClick={() => triggerFileUpload('banner2_image_url')}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GREAT DEALS */}
        {/* ========================================================================= */}
        {activeTab === 'deals' && (
          <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                Great Deals Products Selection
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select 3 products to highlight under the Great Deals section of the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="p-4 bg-[#111C3A] rounded-xl border border-sky-900/50 space-y-2">
                  <label className="text-xs font-bold text-slate-300">
                    Deal Product #{idx + 1}
                  </label>
                  <select
                    value={form.deals_product_ids?.[idx] || ''}
                    onChange={(e) => handleDealsProductChange(idx, e.target.value)}
                    className="w-full bg-[#0A1128] text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-sky-900/50 font-bold"
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — AED {p.price}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CUSTOMER REVIEWS MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                  Homepage Customer Reviews Manager
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit, or remove customer testimonials shown on the live homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newRev: CustomerReview = {
                    id: `rev-${Date.now()}`,
                    name: 'New Customer',
                    role: 'Verified Buyer • Dubai',
                    rating: 5,
                    avatar: '/avatars/customer-1.png',
                    reviewTitle: 'Excellent Experience',
                    reviewText: 'Write review text here...',
                    date: 'Just now'
                  };
                  handleChange('customer_reviews', [...(form.customer_reviews || []), newRev]);
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Review</span>
              </button>
            </div>

            <div className="space-y-6">
              {(form.customer_reviews || []).map((review, idx) => (
                <div key={review.id || idx} className="p-5 bg-[#0D1630] rounded-2xl border border-sky-900/60 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-sky-400 uppercase tracking-widest">
                      Review #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (form.customer_reviews || []).filter((_, i) => i !== idx);
                        handleChange('customer_reviews', updated);
                      }}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Customer Name</label>
                      <input
                        type="text"
                        value={review.name || ''}
                        onChange={(e) => {
                          const updated = [...(form.customer_reviews || [])];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          handleChange('customer_reviews', updated);
                        }}
                        className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Role / Location Tag</label>
                      <input
                        type="text"
                        value={review.role || ''}
                        onChange={(e) => {
                          const updated = [...(form.customer_reviews || [])];
                          updated[idx] = { ...updated[idx], role: e.target.value };
                          handleChange('customer_reviews', updated);
                        }}
                        className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                        placeholder="e.g. Verified Buyer • Deira, Dubai"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Star Rating (1 - 5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={review.rating || 5}
                        onChange={(e) => {
                          const updated = [...(form.customer_reviews || [])];
                          updated[idx] = { ...updated[idx], rating: Number(e.target.value) };
                          handleChange('customer_reviews', updated);
                        }}
                        className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Review Headline</label>
                    <input
                      type="text"
                      value={review.reviewTitle || ''}
                      onChange={(e) => {
                        const updated = [...(form.customer_reviews || [])];
                        updated[idx] = { ...updated[idx], reviewTitle: e.target.value };
                        handleChange('customer_reviews', updated);
                      }}
                      className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Review Feedback Text</label>
                    <textarea
                      rows={2}
                      value={review.reviewText || ''}
                      onChange={(e) => {
                        const updated = [...(form.customer_reviews || [])];
                        updated[idx] = { ...updated[idx], reviewText: e.target.value };
                        handleChange('customer_reviews', updated);
                      }}
                      className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Avatar Image Path / URL</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={review.avatar || ''}
                        onChange={(e) => {
                          const updated = [...(form.customer_reviews || [])];
                          updated[idx] = { ...updated[idx], avatar: e.target.value };
                          handleChange('customer_reviews', updated);
                        }}
                        className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                      />
                      {review.avatar && (
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-sky-700 shrink-0">
                          <img src={review.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
