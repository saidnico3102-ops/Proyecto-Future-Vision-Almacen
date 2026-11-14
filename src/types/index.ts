// ─── Database-aligned TypeScript Interfaces ───
// These types mirror a future PostgreSQL/Supabase schema

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size_us: number;
  size_eu: number;
  stock: number;
  sku: string;
  created_at: string;
}

export interface Product {
  id: number;
  brand_id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  is_featured: boolean;
  is_new: boolean;
  gender: 'unisex' | 'men' | 'women';
  colorway: string;
  release_date: string;
  created_at: string;
  updated_at: string;
  // Relaciones (populated from joins)
  brand: Brand;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

// ─── Frontend-specific types ───

export interface FilterState {
  brands: number[];
  categories: number[];
  priceRange: [number, number];
  sizes: number[];
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'name_asc';
  searchQuery: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  added_at: string;
}
