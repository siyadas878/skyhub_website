'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Search, ChevronDown, Plus, Minus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductListingViewProps {
  pageTitle: string;
  pageSubtitle: string;
  badgeTag?: string;
  products: Product[];
  categoriesList?: { id: string; name: string; count: number }[];
}

export function ProductListingView({
  pageTitle,
  pageSubtitle,
  badgeTag = 'ALL PRODUCTS',
  products,
  categoriesList = [],
}: ProductListingViewProps) {
  const searchParams = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default');

  // Sync state from URL parameters on load or URL change
  useEffect(() => {
    if (searchParams) {
      const condParam = searchParams.get('condition');
      if (condParam) setSelectedCondition(condParam);

      const brandParam = searchParams.get('brand');
      if (brandParam) setSelectedCategory(brandParam);

      const catParam = searchParams.get('category');
      if (catParam) setSelectedCategory(catParam);

      const searchParam = searchParams.get('search');
      if (searchParam) setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Accordion Expand States
  const [expandCategory, setExpandCategory] = useState(true);
  const [expandPrice, setExpandPrice] = useState(true);
  const [expandCondition, setExpandCondition] = useState(true);
  const [expandPopular, setExpandPopular] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setMaxPrice(12000);
    setOnlyDiscounted(false);
    setOnlyFeatured(false);
    setSortBy('default');
    setCurrentPage(1);
  };

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Category & Brand Filter (smart match across ID, Slug, and Name)
      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const matchesCatId = product.category_id === selectedCategory;
        const matchesBrandId = product.brand_id === selectedCategory;
        const matchesCatSlug = product.category?.slug.toLowerCase() === cat;
        const matchesBrandSlug = product.brand?.slug.toLowerCase() === cat;
        const matchesSlug = product.slug.toLowerCase().includes(cat);
        const matchesName = product.name.toLowerCase().includes(cat);

        if (!matchesCatId && !matchesBrandId && !matchesCatSlug && !matchesBrandSlug && !matchesSlug && !matchesName) {
          return false;
        }
      }

      // Condition Filter
      if (selectedCondition !== 'all') {
        if (selectedCondition === 'Used' && product.condition !== 'Used' && product.condition !== 'Refurbished') return false;
        if (selectedCondition === 'New' && product.condition !== 'New') return false;
      }

      // Max price Filter
      if (product.price > maxPrice) return false;

      // Discounted Filter
      if (onlyDiscounted && (!product.original_price || product.original_price <= product.price)) return false;

      // Featured Filter
      if (onlyFeatured && !product.featured) return false;

      // Search query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand?.name.toLowerCase().includes(q);
        const matchesCategory = product.category?.name.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      return true;
    });

    // Sorting Logic
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => (b.condition === 'New' ? 1 : -1));
    }

    return result;
  }, [products, selectedCategory, selectedCondition, maxPrice, onlyDiscounted, onlyFeatured, searchQuery, sortBy]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="space-y-8">
      
      {/* Listing Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter (ORRIS Style) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
            
            {/* Header line: "Filter" + "Reset Filter" */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Filter</h2>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#EA3829] hover:underline flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            </div>

            {/* Accordion 1: Categories */}
            <div className="border-b border-slate-100 pb-5">
              <button
                onClick={() => setExpandCategory(!expandCategory)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider py-1"
              >
                <span>Categories</span>
                {expandCategory ? <Minus className="w-3.5 h-3.5 text-slate-400" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {expandCategory && (
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <label className="flex items-center justify-between cursor-pointer group py-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="rounded accent-[#EA3829]"
                      />
                      <span className={`group-hover:text-[#EA3829] ${selectedCategory === 'all' ? 'font-bold text-slate-900' : ''}`}>
                        All Items
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{products.length}</span>
                  </label>

                  {categoriesList.map((cat) => (
                    <label key={cat.id} className="flex items-center justify-between cursor-pointer group py-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="rounded accent-[#EA3829]"
                        />
                        <span className={`group-hover:text-[#EA3829] ${selectedCategory === cat.id ? 'font-bold text-slate-900' : ''}`}>
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{cat.count}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Price Slider & Quick Pills */}
            <div className="border-b border-slate-100 pb-5">
              <button
                onClick={() => setExpandPrice(!expandPrice)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider py-1"
              >
                <span>Price (AED)</span>
                {expandPrice ? <Minus className="w-3.5 h-3.5 text-slate-400" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {expandPrice && (
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>AED 0</span>
                    <span className="text-[#EA3829]">Up to AED {maxPrice.toLocaleString()}</span>
                  </div>

                  <input
                    type="range"
                    min={500}
                    max={12000}
                    step={250}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#EA3829] cursor-pointer"
                  />

                  {/* Quick Price Range Pills */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {[
                      { label: 'Under AED 1.5k', val: 1500 },
                      { label: 'Under AED 3k', val: 3000 },
                      { label: 'Under AED 5k', val: 5000 },
                      { label: 'Any Price', val: 12000 },
                    ].map((pill) => (
                      <button
                        key={pill.label}
                        onClick={() => setMaxPrice(pill.val)}
                        className={`text-[10px] font-semibold py-1.5 px-2 rounded-lg border transition-colors ${
                          maxPrice === pill.val
                            ? 'bg-[#EA3829] text-white border-[#EA3829]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Condition (New / Pre-Owned) */}
            <div className="border-b border-slate-100 pb-5">
              <button
                onClick={() => setExpandCondition(!expandCondition)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider py-1"
              >
                <span>Condition Grade</span>
                {expandCondition ? <Minus className="w-3.5 h-3.5 text-slate-400" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {expandCondition && (
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  {[
                    { id: 'all', label: 'All Conditions' },
                    { id: 'New', label: 'Brand New Sealed' },
                    { id: 'Used', label: 'Pre-Owned (Quality Certified)' },
                  ].map((cond) => (
                    <label key={cond.id} className="flex items-center space-x-2 cursor-pointer group py-0.5">
                      <input
                        type="radio"
                        name="condition"
                        checked={selectedCondition === cond.id}
                        onChange={() => setSelectedCondition(cond.id)}
                        className="rounded accent-[#EA3829]"
                      />
                      <span className={`group-hover:text-[#EA3829] ${selectedCondition === cond.id ? 'font-bold text-slate-900' : ''}`}>
                        {cond.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 4: Special Filters */}
            <div>
              <button
                onClick={() => setExpandPopular(!expandPopular)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider py-1"
              >
                <span>Status & Offers</span>
                {expandPopular ? <Minus className="w-3.5 h-3.5 text-slate-400" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {expandPopular && (
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <label className="flex items-center space-x-2 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={onlyFeatured}
                      onChange={(e) => setOnlyFeatured(e.target.checked)}
                      className="rounded accent-[#EA3829]"
                    />
                    <span>Best Seller Items</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="rounded accent-[#EA3829]"
                    />
                    <span>On Special Discount</span>
                  </label>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Main Content Area (ORRIS Header & Grid) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Bar (Tag + Title on left, Sort + Search on right) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-[#EA3829] tracking-widest uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA3829]" />
                <span>{badgeTag}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">{pageTitle}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{pageSubtitle}</p>
            </div>

            {/* Controls: Sort Dropdown + Search Box */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-slate-50 text-slate-800 text-xs font-semibold px-3.5 py-2.5 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EA3829] cursor-pointer"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Search Box */}
              <div className="relative flex-1 md:w-56">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3.5 py-2.5 border border-slate-200 focus:outline-none focus:border-[#EA3829]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>

            </div>
          </div>

          {/* Product Cards Grid (3 Columns Desktop) */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No products match your filters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try expanding your price range or resetting search filters to explore all available devices.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 text-xs font-bold text-white bg-[#EA3829] hover:bg-[#D32F2F] px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Bar (ORRIS Pill Style) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-[#EA3829] text-white shadow-md scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
