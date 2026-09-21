export type ProductCondition = 'New' | 'Used' | 'Refurbished';
export type ConditionGrade = 'Excellent' | 'Very Good' | 'Good' | 'Fair';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  is_active: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path?: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  sku?: string;
  price: number;
  stock_quantity: number;
  is_available: boolean;
}

export interface Product {
  id: string;
  category_id?: string;
  brand_id?: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  condition: ProductCondition;
  condition_grade?: ConditionGrade;
  price: number;
  original_price?: number;
  stock_quantity: number;
  is_available: boolean;
  featured: boolean;
  is_active: boolean;
  specifications: Record<string, string | number | boolean>;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  // Joined fields
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductInquiry {
  id: string;
  product_id?: string;
  customer_name: string;
  phone: string;
  email?: string;
  message?: string;
  source: 'WhatsApp' | 'Call' | 'Form';
  status: 'New' | 'Contacted' | 'Completed' | 'Cancelled';
  created_at?: string;
  product?: Product;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  logo_url?: string;
  phone: string;
  whatsapp_number: string;
  email?: string;
  address?: string;
  google_maps_url?: string;
  opening_hours?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  description?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  created_at?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
  reviewTitle: string;
  reviewText: string;
  date?: string;
}

export interface HomepageSettings {
  id?: string;
  // Hero Section
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_button_text: string;
  hero_primary_button_url: string;
  hero_secondary_button_text: string;
  hero_rating_text: string;
  hero_rating_subtext: string;
  hero_image_url: string;

  // Best Picks Bento Grid Selection
  best_picks_title: string;
  main_featured_product_id: string;
  secondary_featured_product_ids: string[];

  // Banner 1 Showcase
  banner1_badge: string;
  banner1_title: string;
  banner1_subtitle: string;
  banner1_button_text: string;
  banner1_button_url: string;
  banner1_image_url: string;

  // Dual Side-by-Side Promo Banners
  promo_left_badge: string;
  promo_left_title: string;
  promo_left_subtitle: string;
  promo_left_button_text: string;
  promo_left_button_url: string;
  promo_left_image_url: string;

  promo_right_badge: string;
  promo_right_title: string;
  promo_right_subtitle: string;
  promo_right_button_text: string;
  promo_right_button_url: string;
  promo_right_image_url: string;

  // Banner 2 Showcase
  banner2_badge: string;
  banner2_title: string;
  banner2_subtitle: string;
  banner2_button_text: string;
  banner2_button_url: string;
  banner2_image_url: string;

  // Great Deals Selected Products
  deals_title: string;
  deals_product_ids: string[];

  // Customer Reviews & Ratings
  customer_reviews?: CustomerReview[];

  updated_at?: string;
}
