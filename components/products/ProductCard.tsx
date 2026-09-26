'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatAED } from '@/lib/utils/currency';
import { generateProductWhatsAppLink } from '@/lib/utils/whatsapp';
import { MessageCircle, Eye, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [, setIsHovered] = useState(false);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.is_primary)?.image_url || product.images[0].image_url
      : '/products/dell-latitude-5480.jpg';

  const hasDiscount = Boolean(product.original_price && product.original_price > product.price);
  const whatsappUrl = generateProductWhatsAppLink(product);

  const categoryName = product.category?.name || product.brand?.name || 'Electronics';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-3.5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Product Image Container (Full Edge-to-Edge Fill) */}
      <div className="relative aspect-square w-full bg-[#0B0F19] rounded-xl overflow-hidden mb-3 group/img">
        
        {/* Top-Left Badge Pills */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 pointer-events-none">
          {product.condition === 'New' && (
            <span className="bg-[#EA3829] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
              NEW
            </span>
          )}
          {product.condition === 'Used' && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/50 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
              PRE-OWNED
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
              HOT ITEM
            </span>
          )}
        </div>

        {/* WhatsApp Floating Button on Top Right (Vibrant Green Circle) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2.5 right-2.5 z-20 w-8.5 h-8.5 rounded-full bg-[#25D366] hover:bg-[#1ebd59] text-white flex items-center justify-center p-1.5 shadow-lg border border-emerald-400/40 transition-all duration-200 hover:scale-110"
          title="Inquire on WhatsApp"
        >
          <img src="/whatsapp.svg" alt="WhatsApp" className="w-full h-full object-contain" />
        </a>

        {/* Main Product Image Link (Edge-to-Edge Cover Fill) */}
        <Link href={`/products/${product.slug}`} className="absolute inset-0 w-full h-full block">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover object-center scale-[1.03] group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Subtle gradient vignette to blend edges smoothly */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </Link>

        {/* Quick View Hover Pill Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Link
            href={`/products/${product.slug}`}
            className="w-full bg-[#0B0F19]/90 hover:bg-[#EA3829] text-white text-[11px] font-bold py-2 px-3 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-colors border border-slate-700/50 backdrop-blur-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
            <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>


      {/* Info Section Below Image Box (ORRIS Clean Alignment) */}
      <div className="flex flex-col flex-1 justify-between px-1">
        
        {/* Line 1: Title (Left) + Price (Right) */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#EA3829] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          
          <div className="text-right shrink-0">
            <span className="text-sm font-extrabold text-[#EA3829] block leading-tight">
              {formatAED(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through block font-medium">
                {formatAED(product.original_price!)}
              </span>
            )}
          </div>
        </div>

        {/* Line 2: Category Subtext (Left) + Color Swatch Dots (Right) */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100 mt-1">
          <span className="font-medium text-[11px] text-slate-400 capitalize truncate">
            {categoryName}
          </span>

          {/* Color Swatch Dots Preview (ORRIS Style) */}
          <div className="flex items-center space-x-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-300 inline-block" title="Space Black" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-slate-300 inline-block" title="Titanium" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-300 inline-block" title="Silver" />
          </div>
        </div>

      </div>
    </div>
  );
}


