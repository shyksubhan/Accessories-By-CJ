import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

// Bug 2 Fix: persist cart items in localStorage so the cart survives
// page refreshes and browser tab closes.
const CART_STORAGE_KEY = "cj_cart_items";

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Basic shape validation — if the data is corrupted, start fresh.
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.product &&
        typeof item.product.id === "string" &&
        typeof item.quantity === "number"
    );
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage can be unavailable (private mode quota, etc.) — fail silently.
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Bug 2 Fix: initialise state from localStorage instead of always []
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  // Bug 2 Fix: mirror every state change to localStorage
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        toast.success(`${product.name} quantity updated`, {
          description: `Qty: ${existing.quantity + 1}`,
          duration: 2000,
        });
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      toast.success("Added to cart", {
        description: product.name,
        duration: 2000,
      });
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
