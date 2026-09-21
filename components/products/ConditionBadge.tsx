'use client';

import React from 'react';
import { ProductCondition, ConditionGrade } from '@/types';
import { ShieldCheck, Sparkles, RefreshCw, XCircle } from 'lucide-react';

interface ConditionBadgeProps {
  condition: ProductCondition;
  conditionGrade?: ConditionGrade;
  isAvailable?: boolean;
  className?: string;
}

export function ConditionBadge({ condition, conditionGrade, isAvailable = true, className = '' }: ConditionBadgeProps) {
  if (!isAvailable) {
    return (
      <span className={`inline-flex items-center gap-1 bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-red-400" />
        <span>SOLD OUT</span>
      </span>
    );
  }

  if (condition === 'New') {
    return (
      <span className={`inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Brand New</span>
      </span>
    );
  }

  if (condition === 'Refurbished') {
    return (
      <span className={`inline-flex items-center gap-1 bg-sky-950/80 border border-sky-700/60 text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
        <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
        <span>Refurbished {conditionGrade ? `(${conditionGrade})` : ''}</span>
      </span>
    );
  }

  // Pre-owned / Used
  return (
    <span className={`inline-flex items-center gap-1 bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
      <span>Used • {conditionGrade || 'Quality Checked'}</span>
    </span>
  );
}
