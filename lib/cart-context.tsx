"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Product } from "./products";

export type CartItem = Pick<
  Product,
  "slug" | "nombre" | "precio" | "talla" | "lote" | "categoria"
>;

interface CartContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  subtotal: number;
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "undisclosed:expediente";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage unavailable or corrupted — start with an empty cart
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  function add(item: CartItem) {
    setItems((prev) =>
      prev.some((p) => p.slug === item.slug) ? prev : [...prev, item]
    );
  }

  function remove(slug: string) {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  function has(slug: string) {
    return items.some((p) => p.slug === slug);
  }

  const subtotal = items.reduce((sum, i) => sum + i.precio, 0);

  return (
    <CartContext.Provider
      value={{ items, add, remove, clear, has, subtotal, ready }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
