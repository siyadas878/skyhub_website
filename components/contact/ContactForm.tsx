'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          message: formData.message,
          source: 'Website Contact Form'
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to send inquiry. Please try again.');
      }
    } catch {
      setErrorMsg('An error occurred. Please try contacting us on WhatsApp or phone.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div>
        <span className="text-[10px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
          • FAST INQUIRY
        </span>
        <h3 className="text-2xl font-black text-slate-900">Send Us a Direct Message</h3>
        <p className="text-xs text-slate-500 mt-1">
          Looking for a specific device or trade-in estimate? Fill out the form below.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="text-lg font-bold text-slate-900">Inquiry Received!</h4>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Thank you for contacting SKYHUB DUBAI. Our store staff will review your request and get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-[#EA3829] hover:underline font-bold pt-2 block mx-auto"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} action="/api/inquiries" method="POST" className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-bold text-slate-700 block">
                Your Full Name
              </label>
              <input
                id="contact-name"
                name="customer_name"
                type="text"
                required
                placeholder="e.g. Ahmed Al Mansoori"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-xs font-bold text-slate-700 block">
                Phone / Mobile Number
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                required
                placeholder="+971 50 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="text-xs font-bold text-slate-700 block">
              Email Address (Optional)
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-xs font-bold text-slate-700 block">
              Your Inquiry Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              placeholder="Tell us which mobile phone, laptop model or accessory you are looking for..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#EA3829] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-102 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Inquiry to SKYHUB</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
