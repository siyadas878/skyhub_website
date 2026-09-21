'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useStore } from '@/lib/supabase/store-context';
import { ProductCondition, ConditionGrade } from '@/types';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, Sparkles, Star, Upload, Loader2, Link2, CheckCircle2 } from 'lucide-react';

function NewProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdToEdit = searchParams.get('id');

  const { categories, brands, products, addProduct, updateProduct } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('Used');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('Excellent');
  const [price, setPrice] = useState<number | ''>(2499);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(3299);
  const [stock, setStock] = useState<number>(1);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  
  // Array of stored photo URLs (from Supabase Bucket or URL input)
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Dynamic JSONB Specification list
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'storage', value: '256GB' },
    { key: 'ram', value: '8GB' },
    { key: 'color', value: 'Natural Titanium' },
    { key: 'battery_health', value: '94%' },
  ]);

  // Set default category and brand once loaded
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
    if (brands.length > 0 && !brandId) {
      setBrandId(brands[0].id);
    }
  }, [categories, brands, categoryId, brandId]);

  // If in Edit Mode, populate existing product details
  useEffect(() => {
    if (productIdToEdit && products.length > 0) {
      const existing = products.find((p) => p.id === productIdToEdit);
      if (existing) {
        setName(existing.name || '');
        setCategoryId(existing.category_id || categories[0]?.id || '');
        setBrandId(existing.brand_id || brands[0]?.id || '');
        setSku(existing.sku || '');
        setDescription(existing.description || '');
        setCondition(existing.condition || 'Used');
        setConditionGrade(existing.condition_grade || 'Excellent');
        setPrice(existing.price || 0);
        setOriginalPrice(existing.original_price || '');
        setStock(existing.stock_quantity ?? 1);
        setIsAvailable(existing.is_available !== false);

        // Load images
        if (existing.images && existing.images.length > 0) {
          setImageUrls(existing.images.map(img => img.image_url));
        } else if (existing.image_url) {
          setImageUrls([existing.image_url]);
        }

        // Load specs
        if (existing.specifications && typeof existing.specifications === 'object') {
          const loadedSpecs = Object.entries(existing.specifications).map(([key, value]) => ({
            key,
            value: String(value)
          }));
          if (loadedSpecs.length > 0) {
            setSpecs(loadedSpecs);
          }
        }
      }
    }
  }, [productIdToEdit, products, categories, brands]);

  // Handle uploading device files to Supabase Storage Bucket
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image files');
      }

      if (data.urls && data.urls.length > 0) {
        setImageUrls((prev) => [...prev, ...data.urls]);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert(`Error uploading file: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setImageUrls((prev) => [...prev, manualUrlInput.trim()]);
    setManualUrlInput('');
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const setAsPrimaryImage = (index: number) => {
    if (index === 0) return;
    const updated = [...imageUrls];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImageUrls(updated);
  };

  // Spec handlers
  const addSpecField = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const updateSpec = (index: number, key: string, value: string) => {
    const updated = [...specs];
    updated[index] = { key, value };
    setSpecs(updated);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a product name');

    const cleanImageUrls = imageUrls.map(url => url.trim()).filter(url => url.length > 0);
    if (cleanImageUrls.length === 0) {
      return alert('Please upload at least one image from your device');
    }

    setSubmitting(true);
    const specObject = specs.reduce((acc, curr) => {
      if (curr.key.trim() && curr.value.trim()) {
        acc[curr.key.trim()] = curr.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      name,
      category_id: categoryId,
      brand_id: brandId,
      sku,
      description,
      condition,
      condition_grade: conditionGrade,
      price: Number(price),
      original_price: originalPrice ? Number(originalPrice) : undefined,
      stock_quantity: stock,
      is_available: isAvailable,
      image_urls: cleanImageUrls,
      image_url: cleanImageUrls[0],
      specifications: specObject
    };

    let success = false;
    if (productIdToEdit) {
      success = await updateProduct(productIdToEdit, payload);
    } else {
      success = await addProduct(payload);
    }

    setSubmitting(false);

    if (success) {
      alert(`Product successfully ${productIdToEdit ? 'updated' : 'created'} in inventory & saved in Supabase storage!`);
      router.push('/admin/products');
    } else {
      alert('Failed to save product. Please check network connection.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-sky-950 text-sky-400 hover:bg-sky-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {productIdToEdit ? 'Edit Product Listing' : 'Create New Product Listing'}
              </h1>
              <p className="text-xs text-slate-400">
                {productIdToEdit ? 'Update product details and uploaded photos' : 'Upload device photos directly to Supabase storage bucket'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={submitting || uploading}
            className="gradient-bg-sky hover:opacity-90 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : productIdToEdit ? 'Update Product' : 'Save Product to Database'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Main Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* General Info */}
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                1. Basic Information
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Product Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 15 Pro Max 256GB - Natural Titanium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3.5 py-3 border border-sky-900/50 focus:outline-none focus:border-sky-400 font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Brand</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3.5 py-3 border border-sky-900/50 focus:outline-none focus:border-sky-400 font-semibold"
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description & Store Condition Notes</label>
                <textarea
                  rows={4}
                  placeholder="Detailed description of the device condition, box contents, battery health percentage, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>
            </div>

            {/* Dynamic JSONB Specification Builder */}
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>2. Dynamic Specifications (JSONB)</span>
                </h3>
                <button
                  type="button"
                  onClick={addSpecField}
                  className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Spec Field</span>
                </button>
              </div>

              <div className="space-y-3">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Key (e.g. storage, ram, battery_health)"
                      value={spec.key}
                      onChange={(e) => updateSpec(idx, e.target.value, spec.value)}
                      className="w-1/2 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-sky-900/50 focus:outline-none focus:border-sky-400"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 256GB, 94%)"
                      value={spec.value}
                      onChange={(e) => updateSpec(idx, spec.key, e.target.value)}
                      className="w-1/2 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-sky-900/50 focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Storage Bucket Device Upload (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Condition & Pricing */}
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
                3. Condition & Pricing
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Device Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ProductCondition)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-sky-900/50 focus:outline-none focus:border-sky-400 font-semibold"
                  >
                    <option value="New">Brand New Sealed</option>
                    <option value="Used">Pre-Owned / Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Condition Grade</label>
                  <select
                    value={conditionGrade}
                    onChange={(e) => setConditionGrade(e.target.value as ConditionGrade)}
                    disabled={condition === 'New'}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-sky-900/50 focus:outline-none focus:border-sky-400 font-semibold disabled:opacity-50"
                  >
                    <option value="Excellent">Excellent (Like New)</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Selling Price (AED)</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 focus:outline-none focus:border-sky-400 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Original / Strike Price</label>
                  <input
                    type="number"
                    placeholder="3299"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">SKU Code</label>
                <input
                  type="text"
                  placeholder="e.g. SKU-IP15PM-256"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-2.5 border border-sky-900/50"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    Device is Available for Sale (Checked = Active)
                  </span>
                </label>
              </div>
            </div>

            {/* Device Image Upload Zone (Supabase Storage Bucket) */}
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>4. Product Device Images ({imageUrls.length})</span>
                </h3>
              </div>

              <p className="text-[11px] text-slate-400">
                Upload multiple images from your computer or phone directly to Supabase Storage Bucket.
              </p>

              {/* Upload Dropzone Container */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="device-file-upload"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-600/50 hover:border-sky-400 rounded-2xl p-6 text-center cursor-pointer bg-[#0A1226]/80 hover:bg-[#111C3A] transition-all group"
              >
                {uploading ? (
                  <div className="flex flex-col items-center py-2 space-y-2 text-sky-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-bold">Uploading files to Supabase bucket...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2 space-y-2">
                    <div className="p-3 bg-sky-950 rounded-full text-sky-400 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Click to Upload Images from Device</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Supports PNG, JPG, WEBP • Select multiple files</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual URL Input Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-sky-400 flex items-center gap-1.5 underline"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{showUrlInput ? 'Hide Image URL input' : 'Or add via image URL link'}</span>
                </button>

                {showUrlInput && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      value={manualUrlInput}
                      onChange={(e) => setManualUrlInput(e.target.value)}
                      className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3.5 py-2 border border-sky-900/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-2 rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Uploaded Images Gallery List */}
              {imageUrls.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Uploaded Photos Gallery:
                    </label>
                    <span className="text-[10px] text-slate-400">First photo is Main Cover</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-[#070C1B] border group ${
                          idx === 0 ? 'border-sky-400 ring-2 ring-sky-400/30' : 'border-sky-900/60'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Product photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                          {idx === 0 ? (
                            <span className="bg-sky-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-white" /> Main Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAsPrimaryImage(idx)}
                              className="bg-black/70 hover:bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Make Main
                            </button>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeImageUrl(idx)}
                          className="absolute top-2 right-2 bg-red-950/80 hover:bg-red-600 text-white p-1.5 rounded-lg backdrop-blur-md transition-colors shadow-md z-10"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="absolute bottom-1 right-2 text-[9px] text-white/70 font-semibold drop-shadow">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading product form...</div>}>
      <NewProductForm />
    </Suspense>
  );
}
