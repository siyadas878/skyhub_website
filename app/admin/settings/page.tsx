'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useStore } from '@/lib/supabase/store-context';
import { Save, Settings, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const { storeSettings, updateStoreSettings } = useStore();
  const [settings, setSettings] = useState(storeSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(storeSettings);
  }, [storeSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Store Info <span className="gradient-text-sky">Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update store phone number, WhatsApp conversion link target, showroom address & hours.
          </p>
        </div>

        <div className="max-w-3xl">
          <form onSubmit={handleSave} className="glass-card rounded-2xl p-8 border border-sky-800/40 space-y-6">
            {saved && (
              <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-xl p-4 flex items-center space-x-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Store contact settings saved successfully!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Store Call Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">WhatsApp Sales Number</label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Showroom Physical Address</label>
              <textarea
                rows={3}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Google Maps URL Location</label>
              <input
                type="text"
                value={settings.google_maps_url || ''}
                onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Business Description</label>
              <textarea
                rows={3}
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Instagram URL</label>
                <input
                  type="text"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Facebook URL</label>
                <input
                  type="text"
                  value={settings.facebook_url || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">TikTok URL</label>
                <input
                  type="text"
                  value={settings.tiktok_url || ''}
                  onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                  className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl px-4 py-3 border border-sky-900/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="gradient-bg-sky hover:opacity-90 text-white font-bold text-xs px-6 py-3.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-sky-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
