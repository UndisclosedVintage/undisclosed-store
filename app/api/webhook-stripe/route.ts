import { NextResponse } from "next/server";
import Stripe from "stripe";
import { confirmarPago } from "@/lib/pedidos";

// Stripe avisa aquí cuando un pago con tarjeta (USD) se completa.
// Cada aviso viene firmado: se verifica con STRIPE_WEBHOOK_SECRET, así nadie
// puede inventar un pago mandando una petición falsa.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const clave = process.env.STRIPE_SECRET_KEY;
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!clave || !secreto) {
    return NextResponse.json({ error: "Sin configurar." }, { status: 503 });
  }

  const firma = req.headers.get("stripe-signature");
  if (!firma) return NextResponse.json({ error: "Sin firma." }, { status: 400 });

  const stripe = new Stripe(clave);
  let evento: Stripe.Event;
  try {
    evento = stripe.webhooks.constructEvent(await req.text(), firma, secreto);
  } catch {
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  // "completed" cuando se paga con tarjeta; "async_payment_succeeded" para
  // métodos que tardan en confirmarse.
  if (
    evento.type !== "checkout.session.completed" &&
    evento.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ ok: true, ignorado: true });
  }

  const sesion = evento.data.object as Stripe.Checkout.Session;
  const referencia = sesion.client_reference_id || sesion.metadata?.referencia;
  if (sesion.payment_status !== "paid" || !referencia) {
    return NextResponse.json({ ok: true, estado: sesion.payment_status });
  }

  const envio = sesion.collected_information?.shipping_details;
  const dir = envio?.address;

  try {
    const r = await confirmarPago(
      referencia,
      typeof sesion.payment_intent === "string" ? sesion.payment_intent : sesion.id,
      {
        nombre: envio?.name || sesion.customer_details?.name || "",
        email: sesion.customer_details?.email || "",
        telefono: sesion.customer_details?.phone || "",
        direccion: [dir?.line1, dir?.line2].filter(Boolean).join(", "),
        ciudad: dir?.city || "",
        estado: dir?.state || "",
        cp: dir?.postal_code || "",
        pais: dir?.country || "",
      }
    );
    if (!r.ok) {
      console.error(r.error);
      return NextResponse.json({ ok: true, ignorado: true });
    }
    return NextResponse.json({ ok: true, yaProcesado: r.yaProcesado });
  } catch (err) {
    // Un 500 hace que Stripe reintente el aviso
    console.error("Webhook Stripe:", err);
    return NextResponse.json({ error: "Error procesando el aviso." }, { status: 500 });
  }
}
