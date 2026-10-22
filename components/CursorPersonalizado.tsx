"use client";

import { useEffect, useRef } from "react";

// Cursor personalizado: un punto del color de la marca que sigue al mouse con
// un poco de inercia y crece sobre enlaces y botones. Solo se activa en
// dispositivos con mouse y sin "reducir movimiento"; en celular no hace nada.
export default function CursorPersonalizado() {
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;

    const permitido =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!permitido) return;

    const html = document.documentElement;
    let x = -100;
    let y = -100;
    let px = x;
    let py = y;
    let visible = false;
    let raf = 0;

    const INTERACTIVO = "a, button, select, label, summary, [data-cursor]";

    function mover(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        px = x;
        py = y;
        el!.style.opacity = "1";
        html.classList.add("cursor-custom");
      }
      const objetivo = e.target instanceof Element ? e.target : null;
      const activo = !!objetivo?.closest(INTERACTIVO);
      el!.dataset.activo = activo ? "1" : "0";
    }

    function salir() {
      visible = false;
      el!.style.opacity = "0";
      html.classList.remove("cursor-custom");
    }

    function cuadro() {
      px += (x - px) * 0.25;
      py += (y - py) * 0.25;
      el!.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      raf = requestAnimationFrame(cuadro);
    }

    window.addEventListener("mousemove", mover, { passive: true });
    document.addEventListener("mouseleave", salir);
    raf = requestAnimationFrame(cuadro);

    return () => {
      window.removeEventListener("mousemove", mover);
      document.removeEventListener("mouseleave", salir);
      cancelAnimationFrame(raf);
      html.classList.remove("cursor-custom");
    };
  }, []);

  return (
    <div ref={contenedor} className="cursor-follow" aria-hidden="true">
      <span className="cursor-core" />
    </div>
  );
}
