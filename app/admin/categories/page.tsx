'use client';

import React, { useState, useRef } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useStore } from '@/lib/supabase/store-context';
import { Plus, FolderTree, Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // References for file uploads
  const newCatFileInputRef = useRef<HTMLInputElement>(null);
  const [updatingCatId, setUpdatingCatId] = useState<string | null>(null);
  const updatingCatIdRef = useRef<string | null>(null);
  const editCatFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.urls && data.urls[0]) {
        return data.urls[0];
      }
      alert(data.error || 'Failed to upload image');
      return null;
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
      return null;
    }
  };

  const handleNewCatFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const url = await handleFileUpload(files[0]);
    if (url) setImageUrl(url);
    setUploading(false);
  };

  const handleEditCatFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetCatId = updatingCatIdRef.current || updatingCatId;
    const files = e.target.files;
    if (!files || files.length === 0 || !targetCatId) return;
    setUploading(true);
    const url = await handleFileUpload(files[0]);
    if (url) {
      await updateCategory(targetCatId, { image_url: url });
      alert('Category image updated live!');
    }
    setUploading(false);
    updatingCatIdRef.current = null;
    setUpdatingCatId(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await addCategory({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        image_url: imageUrl,
      });
      setName('');
      setSlug('');
      setDescription('');
      setImageUrl('');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category? Changes will reflect live across the website.')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      {/* Hidden file input for new category */}
      <input
        ref={newCatFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleNewCatFileChange}
        className="hidden"
      />

      {/* Hidden file input for updating category */}
      <input
        ref={editCatFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleEditCatFileChange}
        className="hidden"
      />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Category <span className="gradient-text-sky">Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage product categories, customize category images, and organize website navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Category Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </h3>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Watches"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. smart-watches"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief category summary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 resize-none"
                  />
                </div>

                {/* Category Image Upload Section */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">Category Showcase Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 bg-[#131E3A] text-slate-100 text-xs rounded-xl px-3 py-2 border border-sky-900/50"
                    />
                    <button
                      type="button"
                      onClick={() => newCatFileInputRef.current?.click()}
                      disabled={uploading}
                      className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
                    >
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Upload</span>
                    </button>
                  </div>

                  {imageUrl && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#070C1B] border border-sky-700 relative mt-2">
                      <img src={imageUrl} alt="Category Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full gradient-bg-sky hover:opacity-90 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Category</span>
                </button>
              </form>
            </div>
          </div>

          {/* Categories List (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-sky-400" />
                <span>Existing Categories ({categories.length})</span>
              </h3>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-[#070C1B] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-sky-950">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      {/* Thumbnail Image */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#0A1128] border border-sky-900 shrink-0">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate">{cat.name}</h4>
                        <span className="text-[11px] text-sky-400 font-mono">/{cat.slug}</span>
                        {cat.description && <p className="text-xs text-slate-400 truncate mt-0.5">{cat.description}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      {/* Upload / Change Image Button */}
                      <button
                        type="button"
                        onClick={() => {
                          updatingCatIdRef.current = cat.id;
                          setUpdatingCatId(cat.id);
                          editCatFileInputRef.current?.click();
                        }}
                        className="bg-sky-900/60 hover:bg-sky-800 text-sky-300 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-sky-700/50 flex items-center space-x-1.5 transition-colors"
                        title="Upload / Change Category Image"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Change Image</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
