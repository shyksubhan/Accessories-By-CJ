// Products are managed via the admin panel and fetched from the backend API.
// This file only retains shared types and helpers used across the frontend.

export interface Product {
  id: string;
  name: string;
  category: "Chargers" | "Cables" | "Power Banks" | "Earbuds" | "Cases";
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  image: string;
  badge?: string;
}

export const categories = ["Chargers", "Cables", "Power Banks", "Earbuds", "Cases"] as const;

// Empty — all products are loaded from backend via productsApi
export const products: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}
