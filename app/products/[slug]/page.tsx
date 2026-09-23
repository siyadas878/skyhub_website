import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImageGallery } from '@/components/products/ImageGallery';
import { ConditionBadge } from '@/components/products/ConditionBadge';
import { ProductCard } from '@/components/products/ProductCard';
import { fetchProductBySlug, fetchProducts } from '@/lib/supabase/queries';
import { formatAED } from '@/lib/utils/currency';
import { generateProductWhatsAppLink, getPhoneNumber } from '@/lib/utils/whatsapp';
import { getSiteUrl } from '@/lib/utils/site-url';
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  ArrowRight
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  const siteUrl = getSiteUrl();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = `${product.name} - Price & Specs in Dubai`;
  const description = `${product.name} available at SKYHUB DUBAI for ${formatAED(product.price)}. ${product.description || 'Authentic hardware thoroughly tested with warranty.'}`;
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  const primaryImage = product.images?.[0]?.image_url || product.image_url || `${siteUrl}/fav_icon.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | SKYHUB DUBAI`,
      description,
      url: canonicalUrl,
      images: [{ url: primaryImage, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | SKYHUB DUBAI`,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const siteUrl = getSiteUrl();
  const allProducts = await fetchProducts();
  const phone = getPhoneNumber();
  const whatsappLink = generateProductWhatsAppLink(product);

  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && (p.category_id === product.category_id || p.brand_id === product.brand_id)
  ).slice(0, 3);

  const specsEntries = Object.entries(product.specifications || {});

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0
      ? product.images.map((i) => i.image_url)
      : [product.image_url || `${siteUrl}/fav_icon.png`],
    description: product.description || 'Authentic hardware thoroughly tested with 35-point quality assurance and official warranty support.',
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'SKYHUB DUBAI',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'AED',
      price: product.price,
      availability: product.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: product.condition === 'New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Organization',
        name: 'SKYHUB DUBAI',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#EA3829] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/mobiles" className="hover:text-[#EA3829] transition-colors">Catalog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Product Detail Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Soft Image Box & Gallery (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Right Column: Title, Specs & CTA (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Category Pill Tag */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-[#EA3829] text-[11px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA3829]" />
                  <span>{product.brand?.name || 'SMART DEVICE'}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  {product.description || 'Authentic hardware thoroughly tested with 35-point quality assurance and official warranty support.'}
                </p>

                <div className="flex items-center space-x-3 pt-2">
                  <ConditionBadge condition={product.condition} conditionGrade={product.condition_grade} isAvailable={product.is_available} />
                  {product.is_available ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock Dubai Store
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 font-bold">Sold Out</span>
                  )}
                </div>
              </div>

              {/* Price Tag */}
              <div className="pt-2 border-t border-slate-100 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-[#EA3829]">
                  {formatAED(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {formatAED(product.original_price)}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-normal">Excl. VAT</span>
              </div>

              {/* CTA Pill Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0B0F19] hover:bg-[#EA3829] text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-full flex items-center justify-between shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-2">
                    <img src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} className="w-5 h-5 shrink-0" />
                    <span>Inquire & Buy via WhatsApp</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#EA3829] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${phone}`}
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-[#EA3829]" />
                    <span>Call Store: +{phone}</span>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Fish+Roundabout+Al+Rigga+Deira+Dubai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
                  >
                    <MapPin className="w-4 h-4 text-[#EA3829]" />
                    <span>Store Location</span>
                  </a>
                </div>
              </div>

              {/* Product Specifications */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                  Product Specifications
                </h3>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Condition Grade</span>
                    <span className="font-bold text-slate-900">{product.condition} ({product.condition_grade || 'Grade A+'})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Warranty</span>
                    <span className="font-bold text-slate-900">SkyHub Store Warranty</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Battery Health</span>
                    <span className="font-bold text-slate-900">90% - 100% Guaranteed</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">SKU / Model</span>
                    <span className="font-bold text-slate-900">{product.sku || 'DXB-98421'}</span>
                  </div>

                  {specsEntries.map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-400 block font-medium capitalize">{k.replace('_', ' ')}</span>
                      <span className="font-bold text-slate-900">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white rounded-xl p-3 text-center border border-slate-200/80 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#EA3829] mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-700 block">100% Authentic</span>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-slate-200/80 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-700 block">35-Point Tested</span>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-slate-200/80 shadow-sm">
                  <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-700 block">Instant Store Pickup</span>
                </div>
              </div>

            </div>

          </div>

          {/* Testimonial Section */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                  • TESTIMONIALS
                </span>
                <h3 className="text-2xl font-black text-slate-900">What Customers Are Saying</h3>
              </div>
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.9 / 5.0 Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {[
                {
                  quote: "Bought a pre-owned iPhone 15 Pro Max from SkyHub. Battery health was 98% and condition was like brand new. Fast WhatsApp response!",
                  name: "Rashid Al Mansoori",
                  role: "Verified Buyer • Dubai",
                },
                {
                  quote: "The M3 Max MacBook Pro was delivered directly to my office in Al Barsha within 2 hours. Super smooth transaction and genuine warranty.",
                  name: "Tariq Mahmood",
                  role: "Verified Buyer • Business Bay",
                },
                {
                  quote: "Excellent pricing for official DJI drones and accessories. The store staff at Fish Roundabout Deira Dubai were very helpful.",
                  name: "Sarah Jenkins",
                  role: "Verified Buyer • JBR",
                },
              ].map((rev, idx) => (
                <div key={idx} className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 space-y-3">
                  <div className="flex items-center text-amber-400 space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-xs font-bold text-slate-900 block">{rev.name}</span>
                    <span className="text-[10px] text-slate-400 block">{rev.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#EA3829] uppercase tracking-widest block mb-1">
                    • RECOMMENDED
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">More Products You Might Like</h3>
                </div>
                <Link
                  href="/mobiles"
                  className="text-xs font-bold text-white bg-[#0B0F19] hover:bg-[#EA3829] px-4 py-2 rounded-full transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}


