'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useStore } from '@/lib/supabase/store-context';
import { ProductInquiry } from '@/types';
import { MessageSquare, Phone, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react';

export default function AdminInquiriesPage() {
  const { inquiries } = useStore();
  const [localInquiries, setLocalInquiries] = useState<ProductInquiry[]>([]);

  const activeInquiries = localInquiries.length > 0 ? localInquiries : inquiries;

  const updateStatus = (id: string, newStatus: ProductInquiry['status']) => {
    setLocalInquiries((prev) =>
      (prev.length > 0 ? prev : inquiries).map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer <span className="gradient-text-sky">Inquiries Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer lead inquiries from WhatsApp click links and direct calls.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sky-800/40 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sky-950 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 font-semibold">Customer</th>
                  <th className="pb-3 px-3 font-semibold">Product Inquired</th>
                  <th className="pb-3 px-3 font-semibold">Source</th>
                  <th className="pb-3 px-3 font-semibold">Message Note</th>
                  <th className="pb-3 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950/60">
                {activeInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-sky-950/30">
                    <td className="py-4 px-3">
                      <div className="font-bold text-white">{inq.customer_name}</div>
                      <div className="text-[11px] text-sky-400">{inq.phone}</div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-semibold text-white max-w-xs truncate">
                        {inq.product?.name || 'General Inventory Inquiry'}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {inq.source === 'WhatsApp' ? <MessageCircle className="w-3 h-3 text-emerald-400" /> : <Phone className="w-3 h-3 text-sky-400" />}
                        <span>{inq.source}</span>
                      </span>
                    </td>
                    <td className="py-4 px-3 text-slate-300 max-w-xs leading-relaxed">
                      {inq.message}
                    </td>
                    <td className="py-4 px-3">
                      <select
                        value={inq.status}
                        onChange={(e) => updateStatus(inq.id, e.target.value as ProductInquiry['status'])}
                        className="bg-[#131E3A] text-slate-100 text-xs rounded-lg px-2.5 py-1.5 border border-sky-900/50 font-semibold focus:outline-none"
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed Sale</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
