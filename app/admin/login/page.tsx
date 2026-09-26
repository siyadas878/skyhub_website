'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { setAdminAuthSession, isAdminAuthenticated } from '@/lib/utils/admin-auth';

function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [expiredMsg, setExpiredMsg] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('expired') === 'true') {
      setExpiredMsg(true);
    }

    // If already authenticated and session hasn't expired, auto-redirect to dashboard
    if (isAdminAuthenticated()) {
      const redirectUrl = searchParams?.get('redirect') || '/admin/dashboard';
      router.push(redirectUrl);
    }
  }, [searchParams, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setExpiredMsg(false);
    setLoading(true);

    const validUser = username.trim().toLowerCase() === 'skyhub' || username.trim().toLowerCase() === 'skyhub@skymediauae.com';
    const validPass = password === 'Skyhub@2026';

    setTimeout(() => {
      setLoading(false);
      if (validUser && validPass) {
        // Set authenticated cookie with 24-hour expiration
        setAdminAuthSession();

        const redirectUrl = searchParams?.get('redirect') || '/admin/dashboard';
        router.push(redirectUrl);
      } else {
        setErrorMsg('Invalid username or password. Please check your admin credentials.');
      }
    }, 500);
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center space-y-3 mb-8 flex flex-col items-center">
        <Link href="/" className="inline-flex items-center space-x-3 bg-[#111111] p-3 rounded-2xl border border-slate-800 shadow-xl">

          <div className="relative h-10 w-36">
            <Image
              src="/sky_hub_logo.png"
              alt="SkyHub Media Logo"
              fill
              className="object-contain"
              sizes="144px"
            />
          </div>
        </Link>
        <p className="text-xs text-slate-400">
          Store Management Portal • Protected Manager Authentication
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-slate-800/80 shadow-2xl space-y-6 bg-[#0B0F19]">
        <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-[#EA3829]">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Staff Authentication</span>
          </div>
          <span className="text-[10px] text-slate-400">24h Session Limit</span>
        </div>

        {expiredMsg && (
          <div className="bg-amber-950/80 border border-amber-700/60 rounded-xl p-3.5 flex items-center space-x-2 text-xs text-amber-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Your admin session has expired. Please sign in again to continue.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-700/60 rounded-xl p-3.5 flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Username or Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:outline-none focus:border-[#EA3829]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131E3A] text-slate-100 text-xs rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:outline-none focus:border-[#EA3829]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EA3829] hover:bg-[#D32F2F] text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-98"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="text-center mt-6">
        <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
          ← Back to Customer Website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#070C1D] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#EA3829]/10 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-slate-400">Loading Login Portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
