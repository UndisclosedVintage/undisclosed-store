"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Moneda } from "./moneda";

const KEY = "undisclosed:moneda";

interface Valor {
  moneda: Moneda;
  setMoneda: (m: Moneda) => void;
}

const MonedaContext = createContext<Valor | null>(null);

export function MonedaProvider({ children }: { children: ReactNode }) {
  const [moneda, setM] = useState<Moneda>("MXN");

  useEffect(() => {
    try {
      const guardada = window.localStorage.getItem(KEY);
      if (guardada === "MXN" || guardada === "USD") setM(guardada);
    } catch {
      // sin localStorage: se queda en MXN
    }
  }, []);

  function setMoneda(m: Moneda) {
    setM(m);
    try {
      window.localStorage.setItem(KEY, m);
    } catch {
      // ignorar
    }
  }

  return (
    <MonedaContext.Provider value={{ moneda, setMoneda }}>
      {children}
    </MonedaContext.Provider>
  );
}

export function useMoneda() {
  const ctx = useContext(MonedaContext);
  if (!ctx) throw new Error("useMoneda debe usarse dentro de MonedaProvider");
  return ctx;
}
