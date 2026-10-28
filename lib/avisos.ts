import { site } from "./site-config";
import { formatear } from "./moneda";
import type { Pedido } from "./pedidos";

// Aviso por correo cuando entra un pedido, usando Resend (resend.com).
// Variables (todas en Vercel):
//   RESEND_API_KEY   obligatoria para que se envíe el correo
//   AVISO_EMAIL      a dónde llega el aviso (por defecto, el correo del sitio)
//   RESEND_FROM      remitente (por defecto onboarding@resend.dev, que solo
//                    puede enviar al correo con el que creaste la cuenta Resend)
// Si no hay RESEND_API_KEY, no pasa nada: el pedido igual queda en /admin/pedidos.

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function avisarPedido(p: Pedido) {
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return;

  const para = process.env.AVISO_EMAIL || site.email;
  const de = process.env.RESEND_FROM || `${site.nombre} <onboarding@resend.dev>`;
  if (!para) return;

  const base = (process.env.NEXT_PUBLIC_SITE_URL || site.dominio).replace(/\/$/, "");
  const c = p.comprador;
  const piezas = p.piezas
    .map((x) => `${x.folio} · ${x.nombre} · ${formatear(x.precio, p.moneda)}`)
    .join("\n");

  const asunto =
    p.estado === "revisar"
      ? `⚠️ Revisar pedido: pago recibido (${formatear(p.total, p.moneda)})`
      : `Nuevo pedido pagado · ${formatear(p.total, p.moneda)}`;

  const texto = [
    p.nota ? `ATENCIÓN: ${p.nota}\n` : "",
    `Pago: ${p.metodo === "stripe" ? "Stripe" : "Mercado Pago"} · ${formatear(p.total, p.moneda)} (envío ${formatear(p.envio, p.moneda)})`,
    `Referencia: ${p.referencia}${p.pagoId ? ` · pago ${p.pagoId}` : ""}`,
    "",
    "PIEZAS",
    piezas,
    "",
    "ENVIAR A",
    c.nombre,
    c.direccion,
    `${c.ciudad}, ${c.estado} ${c.cp}${c.pais ? `, ${c.pais}` : ""}`,
    `Tel: ${c.telefono}`,
    `Correo: ${c.email}`,
    "",
    `Todos los pedidos: ${base}/admin/pedidos`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;max-width:520px;line-height:1.5">${esc(texto).replace(/\n/g, "<br>")}</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clave}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: de, to: [para], subject: asunto, text: texto, html }),
  });
  if (!res.ok) {
    throw new Error(`Resend respondió ${res.status}: ${await res.text()}`);
  }
}
