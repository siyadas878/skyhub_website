'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAdminAuthenticated, clearAdminAuthSession, getAdminExpiryTimestamp } from '@/lib/utils/admin-auth';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // If we are on the login page, render children directly without layout wrapper
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      setIsAuthenticated(false);
      return;
    }

    // Function to check auth validity
    const checkAuthStatus = () => {
      const valid = isAdminAuthenticated();
      if (!valid) {
        clearAdminAuthSession();
        setIsAuthenticated(false);
        setCheckingAuth(false);
        router.push(`/admin/login?expired=true&redirect=${encodeURIComponent(pathname)}`);
      } else {
        setIsAuthenticated(true);
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();

    // Periodic check every 15 seconds to enforce session expiration in real-time
    const interval = setInterval(() => {
      const expiry = getAdminExpiryTimestamp();
      if (!expiry || Date.now() > expiry) {
        clearAdminAuthSession();
        setIsAuthenticated(false);
        router.push('/admin/login?expired=true');
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#070C1D] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EA3829]/20 border border-[#EA3829]/40 flex items-center justify-center text-[#EA3829] animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold tracking-tight">Authenticating Manager Access...</h3>
          <p className="text-xs text-slate-400">Verifying secure admin session and credentials</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070C1D] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-700 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-red-400">Access Denied</h3>
          <p className="text-xs text-slate-400">Redirecting to login portal...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
