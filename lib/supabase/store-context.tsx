'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, StoreSettings, ProductInquiry, HomepageSettings } from '@/types';

const DEFAULT_SETTINGS: StoreSettings = {
  id: 'e1000000-0000-0000-0000-000000000001',
  store_name: 'SKYHUB DUBAI',
  phone: '+971 52 336 1092',
  whatsapp_number: '+971 52 336 1092',
  email: 'info@skyhubmobi.com',
  address: 'Fish Roundabout, Al Rigga, Deira, Dubai, UAE',
  google_maps_url: 'https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOTILCAEQABgKGAsYgAQyEQgCEC4YChgLGK8BGMcBGIAEMhEIAxAuGAoYCxivARjHARiABDIRCAQQLhgKGAsYrwEYxwEYgAQyCwgFEAAYChgLGIAEMgsIBhAAGAoYCxiABDILCAcQABgKGAsYgAQyEQgIEC4YChgLGK8BGMcBGIAEMgsICRAAGAoYCxiABNIBCTQ0MjlqMGoxNagCCLACAfEF9RSlZbfsCAnxBfUUpWW37AgJ&um=1&ie=UTF-8&fb=1&gl=ae&sa=X&geocode=KXW641OVQ18-MYkYCToW81qZ&daddr=fish+round+boat+-+Fish+Roundabout+-+Al+Rigga+-+Deira+-+Dubai',
  opening_hours: 'Sat - Thu: 10:00 AM - 10:00 PM | Fri: 4:00 PM - 10:00 PM',
  instagram_url: 'https://www.instagram.com/sky_hub_official/',
  facebook_url: 'https://www.facebook.com/p/skysbuy-100054198354444',
  tiktok_url: 'https://www.tiktok.com/@skyhubmobi',
  description: 'We do all kind off Mobile phone sales and service Laptop services Photography video Camera accessories Broadcasting and media solutions.'
};

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  id: 'h1000000-0000-0000-0000-000000000001',
  hero_badge: '• FLAGSHIP TECHNOLOGY • DUBAI',
  hero_title: 'Redefining Everyday Tech',
  hero_subtitle: "Experience Dubai's top rated collection of brand new & pre-owned iPhones, MacBooks, Samsung Galaxy Ultra, and pro accessories with guaranteed battery health.",
  hero_primary_button_text: 'Shop Now',
  hero_primary_button_url: '/mobiles',
  hero_secondary_button_text: 'WhatsApp Inquiry',
  hero_rating_text: '4.9 ★ Rating',
  hero_rating_subtext: 'Over 2,500+ Verified Buyers in UAE',
  hero_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/iphone-15-pro-max.png',

  best_picks_title: 'Best Picks For You',
  main_featured_product_id: 'a1000000-0000-0000-0000-000000000001',
  secondary_featured_product_ids: [
    'a1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000008'
  ],

  banner1_badge: 'Next-Gen Foldable & Ultra',
  banner1_title: 'Samsung Galaxy S24 Ultra & Fold Series',
  banner1_subtitle: 'Powered by Galaxy AI, 200MP camera technology, built-in S-Pen, and 12GB RAM for ultimate productivity.',
  banner1_button_text: 'Explore Samsung Line-up',
  banner1_button_url: '/mobiles?brand=samsung',
  banner1_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/samsung-s24-ultra.png',

  promo_left_badge: 'Drone & Fast Power',
  promo_left_title: 'DJI Drones & High-Speed Chargers',
  promo_left_subtitle: 'Flagship DJI Mini 4 Pro 4K HDR drones and 200W high-speed power stations.',
  promo_left_button_text: 'Shop Accessories',
  promo_left_button_url: '/accessories',
  promo_left_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/dji-mini-4-pro.png',

  promo_right_badge: 'M3 Max Performance',
  promo_right_title: 'Apple MacBook Pro 16-inch',
  promo_right_subtitle: 'Extreme performance 36GB / 1TB workstation with Liquid Retina XDR display.',
  promo_right_button_text: 'Shop Workstations',
  promo_right_button_url: '/laptops',
  promo_right_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/macbook-pro-16.png',

  banner2_badge: 'Official Apple Showcase',
  banner2_title: 'Celebrate the Season with iPhone 15 Pro Max',
  banner2_subtitle: 'Grade A+ Pre-Owned & Sealed devices with 35-point testing guarantee and instant store pickup in Bur Dubai.',
  banner2_button_text: 'Shop iPhones',
  banner2_button_url: '/mobiles?brand=apple',
  banner2_image_url: 'https://lxryqeomeomssenymqdp.supabase.co/storage/v1/object/public/skyhub/products/iphone-15-pro-max.png',

  deals_title: 'Great Deals',
  deals_product_ids: [
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002'
  ],
  customer_reviews: [
    {
      id: 'rev-1',
      name: 'Mohammed Al-Hashemi',
      role: 'Verified Buyer • Deira, Dubai',
      rating: 5,
      avatar: '/avatars/customer-4.png',
      reviewTitle: 'Best Mobile Shop in Deira!',
      reviewText: 'Bought an iPhone 15 Pro Max from SKYHUB DUBAI. Device was 100% genuine sealed pack with official warranty. Fast WhatsApp response and friendly staff!',
      date: '2 days ago'
    },
    {
      id: 'rev-2',
      name: 'Sarah Jenkins',
      role: 'Content Creator • Downtown Dubai',
      rating: 5,
      avatar: '/avatars/customer-2.png',
      reviewTitle: 'Amazing Camera & Drone Gear',
      reviewText: 'Got the DJI Mini 4 Pro drone and wireless mics here. Honest pricing, great service, and they tested everything at their Fish Roundabout showroom.',
      date: '1 week ago'
    },
    {
      id: 'rev-3',
      name: 'Alexey Volkov',
      role: 'Software Engineer • Business Bay',
      rating: 5,
      avatar: '/avatars/customer-1.png',
      reviewTitle: 'Pristine MacBook Pro M3',
      reviewText: 'The MacBook Pro condition was beyond expectations! Zero scratches, 100% battery health, and saved over 1,500 AED compared to retail. Highly recommended!',
      date: '2 weeks ago'
    },
    {
      id: 'rev-4',
      name: 'Tariq Al-Maktoum',
      role: 'Business Owner • Jumeirah, Dubai',
      rating: 5,
      avatar: '/avatars/customer-3.png',
      reviewTitle: 'Quick & Honest Service',
      reviewText: 'Outstanding laptop repair & data recovery service. Restored all files from my corrupted SSD in less than 24 hours. Reliable team at SKYHUB.',
      date: '3 weeks ago'
    }
  ]
};

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  storeSettings: StoreSettings;
  homepageSettings: HomepageSettings;
  inquiries: ProductInquiry[];
  loading: boolean;
  
  // Product actions
  addProduct: (product: any) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleAvailability: (id: string) => Promise<boolean>;
  
  // Category actions
  addCategory: (category: Partial<Category>) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Brand actions
  addBrand: (brand: Partial<Brand>) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<boolean>;
  
  // Settings actions
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<boolean>;
  updateHomepageSettings: (settings: Partial<HomepageSettings>) => Promise<boolean>;
  
  // Inquiry actions
  addInquiry: (inquiry: Omit<ProductInquiry, 'id' | 'created_at'>) => Promise<boolean>;
  
  // Refresh data
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [inquiries, setInquiries] = useState<ProductInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);

      const [resProd, resCat, resBrand, resSettings, resHp, resInq] = await Promise.all([
        fetch('/api/products').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/categories').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/brands').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/settings').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/homepage').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/inquiries').then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      if (Array.isArray(resProd)) setProducts(resProd);
      if (Array.isArray(resCat)) setCategories(resCat);
      if (Array.isArray(resBrand)) setBrands(resBrand);
      if (resSettings && (resSettings as any).store_name) setStoreSettings(resSettings as StoreSettings);
      if (resHp && resHp.hero_title) setHomepageSettings(resHp as HomepageSettings);
      if (Array.isArray(resInq)) setInquiries(resInq);
    } catch (err) {
      console.error('Failed to fetch store data from DB API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- ACTIONS ---

  const addProduct = async (productPayload: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      const errData = await res.json();
      console.error('Failed to add product:', errData);
      return false;
    } catch (err) {
      console.error('Error adding product:', err);
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating product:', err);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  };

  const toggleAvailability = async (id: string): Promise<boolean> => {
    const target = products.find(p => p.id === id);
    if (!target) return false;
    const newStatus = !target.is_available;
    return await updateProduct(id, { is_available: newStatus });
  };

  const addCategory = async (categoryPayload: Partial<Category>): Promise<boolean> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryPayload)
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding category:', err);
      return false;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating category:', err);
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting category:', err);
      return false;
    }
  };

  const addBrand = async (brandPayload: Partial<Brand>): Promise<boolean> => {
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandPayload)
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding brand:', err);
      return false;
    }
  };

  const deleteBrand = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting brand:', err);
      return false;
    }
  };

  const updateStoreSettings = async (settingsPayload: Partial<StoreSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsPayload)
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating store settings:', err);
      return false;
    }
  };

  const updateHomepageSettings = async (settingsPayload: Partial<HomepageSettings>): Promise<boolean> => {
    try {
      const merged = { ...homepageSettings, ...settingsPayload };
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      if (res.ok) {
        setHomepageSettings(merged);
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating homepage settings:', err);
      return false;
    }
  };

  const addInquiry = async (inquiryPayload: Omit<ProductInquiry, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryPayload)
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding inquiry:', err);
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        storeSettings,
        homepageSettings,
        inquiries,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        deleteBrand,
        updateStoreSettings,
        updateHomepageSettings,
        addInquiry,
        refreshData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
