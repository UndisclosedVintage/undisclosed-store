"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./products";
import { precioEn, type Moneda } from "./moneda";

export type CartItem = Pick<
  Product,
  "slug" | "nombre" | "precio" | "precioUSD" | "talla" | "lote" | "categoria"
> & { imagen?: string };

interface CartContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  subtotal: (moneda: Moneda) => number;
  sinPrecio: (moneda: Moneda) => CartItem[];
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "undisclosed:seleccion:v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible o dañado: empezamos con la selección vacía
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignorar
    }
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

  function subtotal(moneda: Moneda) {
    return items.reduce((suma, i) => suma + (precioEn(i, moneda) ?? 0), 0);
  }

  function sinPrecio(moneda: Moneda) {
    return items.filter((i) => precioEn(i, moneda) === null);
  }

  return (
    <CartContext.Provider
      value={{ items, add, remove, clear, has, subtotal, sinPrecio, ready }}
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
