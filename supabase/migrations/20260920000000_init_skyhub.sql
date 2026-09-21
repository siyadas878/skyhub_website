-- SQL Migration: 20260920000000_init_skyhub.sql
-- SkyHub Website Database Schema (PostgreSQL + Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admin users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('super_admin', 'admin', 'staff')) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRANDS
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE,
    description TEXT,
    condition TEXT CHECK (condition IN ('New', 'Used', 'Refurbished')) DEFAULT 'New',
    condition_grade TEXT CHECK (condition_grade IN ('Excellent', 'Very Good', 'Good', 'Fair')),
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    stock_quantity INT DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    alt_text TEXT,
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    sku TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT INQUIRIES
CREATE TABLE IF NOT EXISTS product_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    source TEXT CHECK (source IN ('WhatsApp', 'Call', 'Form')) DEFAULT 'WhatsApp',
    status TEXT CHECK (status IN ('New', 'Contacted', 'Completed', 'Cancelled')) DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'SkyHub Media UAE',
    logo_url TEXT,
    phone TEXT NOT NULL DEFAULT '+971 4 339 3234',
    whatsapp_number TEXT NOT NULL DEFAULT '+971 50 123 4567',
    email TEXT DEFAULT 'info@skymediauae.com',
    address TEXT DEFAULT 'Shop # 101 & 102, Al Khaleej Centre, Bur Dubai, Dubai, UAE',
    google_maps_url TEXT DEFAULT 'https://maps.google.com',
    opening_hours TEXT DEFAULT 'Sat - Thu: 10:00 AM - 10:00 PM | Fri: 4:00 PM - 10:00 PM',
    instagram_url TEXT DEFAULT 'https://instagram.com/skymedia.uae',
    facebook_url TEXT DEFAULT 'https://facebook.com/skymediauae',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST SEARCHING
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Allow public read active categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public read active brands" ON brands FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public read active products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public read product images" ON product_images FOR SELECT USING (TRUE);
CREATE POLICY "Allow public read product variants" ON product_variants FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Allow public read store settings" ON store_settings FOR SELECT USING (TRUE);
CREATE POLICY "Allow public insert inquiries" ON product_inquiries FOR INSERT WITH CHECK (TRUE);

-- AUTHENTICATED ADMIN FULL ACCESS
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access categories" ON categories FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access brands" ON brands FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access product_images" ON product_images FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access product_variants" ON product_variants FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access product_inquiries" ON product_inquiries FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access store_settings" ON store_settings FOR ALL TO authenticated USING (TRUE);

-- SEED SELECTION DATA
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Mobile Phones', 'mobiles', 'Latest new & pre-owned smartphones', 1),
('c1000000-0000-0000-0000-000000000002', 'Laptops', 'laptops', 'High performance MacBooks & Windows laptops', 2),
('c1000000-0000-0000-0000-000000000003', 'Accessories', 'accessories', 'Chargers, audio, camera gear & smart gadgets', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (id, name, slug, description, parent_id, sort_order) VALUES
('c2000000-0000-0000-0000-000000000001', 'iPhone', 'iphone', 'Apple iPhones', 'c1000000-0000-0000-0000-000000000001', 1),
('c2000000-0000-0000-0000-000000000002', 'Samsung Galaxy', 'samsung-mobiles', 'Samsung smartphones', 'c1000000-0000-0000-0000-000000000001', 2),
('c2000000-0000-0000-0000-000000000003', 'MacBook', 'macbook', 'Apple MacBooks', 'c1000000-0000-0000-0000-000000000002', 1),
('c2000000-0000-0000-0000-000000000004', 'Windows Laptops', 'windows-laptops', 'Dell, HP, Lenovo laptops', 'c1000000-0000-0000-0000-000000000002', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO brands (id, name, slug) VALUES
('b1000000-0000-0000-0000-000000000001', 'Apple', 'apple'),
('b1000000-0000-0000-0000-000000000002', 'Samsung', 'samsung'),
('b1000000-0000-0000-0000-000000000003', 'Dell', 'dell'),
('b1000000-0000-0000-0000-000000000004', 'Sony', 'sony'),
('b1000000-0000-0000-0000-000000000005', 'DJI', 'dji'),
('b1000000-0000-0000-0000-000000000006', 'Anker', 'anker')
ON CONFLICT (slug) DO NOTHING;

-- STORE SETTINGS SEED
INSERT INTO store_settings (id, store_name, phone, whatsapp_number, email, address) VALUES
('e1000000-0000-0000-0000-000000000001', 'SkyHub Media UAE', '+971 4 339 3234', '+971 50 123 4567', 'info@skymediauae.com', 'Shop # 101 & 102, Al Khaleej Centre, Bur Dubai, Dubai, UAE')
ON CONFLICT (id) DO NOTHING;
