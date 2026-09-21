'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { SearchX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = 'No products found matching your filter criteria.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8 border border-sky-900/30 space-y-4">
        <div className="w-12 h-12 bg-sky-950 text-sky-400 rounded-full flex items-center justify-center mx-auto">
          <SearchX className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-white">No Inventory Matches</h4>
        <p className="text-xs text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
