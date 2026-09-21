'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types';
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface ImageGalleryProps {
  images?: ProductImage[];
  productName: string;
}

export function ImageGallery({ images = [], productName }: ImageGalleryProps) {
  const defaultImages = images.length > 0 ? images : [
    { id: 'def-1', product_id: 'def', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', is_primary: true, sort_order: 1 }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Keep index in bounds if images change
  useEffect(() => {
    if (selectedIndex >= defaultImages.length) {
      setSelectedIndex(0);
    }
  }, [defaultImages.length, selectedIndex]);

  const activeImage = defaultImages[selectedIndex] || defaultImages[0];

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % defaultImages.length);
  }, [defaultImages.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + defaultImages.length) % defaultImages.length);
  }, [defaultImages.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  return (
    <div className="space-y-4">
      {/* Primary Main Image Frame */}
      <div className="relative aspect-[4/3] w-full bg-[#0B0F19] rounded-2xl overflow-hidden border border-slate-800/80 group shadow-md">
        
        <Image
          src={activeImage.image_url}
          alt={activeImage.alt_text || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Lightbox Zoom Trigger Badge */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3.5 right-3.5 bg-[#0B0F19]/80 hover:bg-[#EA3829] text-white p-2.5 rounded-xl backdrop-blur-md transition-all shadow-md flex items-center space-x-1.5 text-xs font-semibold z-10"
          title="Full View / Zoom"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Full View</span>
        </button>

        {/* Floating Image Counter Badge */}
        {defaultImages.length > 1 && (
          <div className="absolute top-3.5 left-3.5 bg-black/60 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md z-10 border border-white/10">
            {selectedIndex + 1} / {defaultImages.length}
          </div>
        )}

        {/* Previous & Next Arrows Slider on Main Frame */}
        {defaultImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#0B0F19]/80 hover:bg-[#EA3829] text-white p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
              title="Previous Photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0B0F19]/80 hover:bg-[#EA3829] text-white p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
              title="Next Photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Multiple Thumbnail Selection Bar */}
      {defaultImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {defaultImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-[#0B0F19] ${
                selectedIndex === idx
                  ? 'border-[#EA3829] ring-2 ring-[#EA3829]/30 scale-95 shadow-md'
                  : 'border-slate-200/80 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal (Full View Mode) */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          
          {/* Lightbox Top Navigation Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-3 text-white">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#EA3829] px-3 py-1 rounded-full">
                Full View
              </span>
              <span className="text-sm font-extrabold text-slate-200 truncate max-w-xs sm:max-w-md">
                {productName}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                {selectedIndex + 1} of {defaultImages.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="text-slate-300 hover:text-white p-2.5 bg-slate-900 hover:bg-[#EA3829] rounded-full transition-colors border border-slate-800"
                title="Close Full View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Display & Navigation Arrows */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            
            {defaultImages.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-10 bg-slate-900/90 hover:bg-[#EA3829] text-white p-3.5 rounded-full backdrop-blur-md transition-all border border-slate-800 shadow-xl"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full h-full max-w-5xl max-h-[75vh]">
              <Image
                src={activeImage.image_url}
                alt={productName}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>

            {defaultImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-10 bg-slate-900/90 hover:bg-[#EA3829] text-white p-3.5 rounded-full backdrop-blur-md transition-all border border-slate-800 shadow-xl"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Navigation Strip */}
          {defaultImages.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 z-10 max-w-2xl mx-auto">
              {defaultImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-[#0B0F19] ${
                    selectedIndex === idx
                      ? 'border-[#EA3829] scale-110 shadow-lg shadow-[#EA3829]/30'
                      : 'border-slate-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={`Full view thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
