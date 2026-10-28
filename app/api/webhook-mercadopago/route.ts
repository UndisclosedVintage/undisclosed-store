import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { confirmarPago } from "@/lib/pedidos";

// Mercado Pago avisa aquí cada vez que cambia un pago.
// No nos fiamos de lo que llega en el aviso: solo tomamos el número de pago y
// se lo preguntamos directamente a Mercado Pago con nuestro token. Así nadie
// puede inventar un "pago aprobado" mandando una petición falsa.

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ error: "Sin configurar." }, { status: 503 });

  const url = new URL(req.url);
  let cuerpo: { type?: string; topic?: string; data?: { id?: string | number } } = {};
  try {
    cuerpo = await req.json();
  } catch {
    // algunos avisos solo traen datos en la URL
  }

  const tipo = cuerpo.type || cuerpo.topic || url.searchParams.get("type") || url.searchParams.get("topic");
  const id = String(cuerpo.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "");

  // Solo nos interesan los pagos; el resto se confirma y se ignora
  if (tipo !== "payment" || !/^\d{3,20}$/.test(id)) {
    return NextResponse.json({ ok: true, ignorado: true });
  }

  try {
    const pago = await new Payment(new MercadoPagoConfig({ accessToken: token })).get({ id });

    if (pago.status !== "approved" || !pago.external_reference) {
      return NextResponse.json({ ok: true, estado: pago.status });
    }

    const r = await confirmarPago(pago.external_reference, String(pago.id ?? id));
    if (!r.ok) {
      // Pago que no es de un pedido de este sitio: se registra y se confirma
      console.error(r.error);
      return NextResponse.json({ ok: true, ignorado: true });
    }
    return NextResponse.json({ ok: true, yaProcesado: r.yaProcesado });
  } catch (err) {
    // Un 500 hace que Mercado Pago reintente el aviso más tarde
    console.error("Webhook Mercado Pago:", err);
    return NextResponse.json({ error: "Error procesando el aviso." }, { status: 500 });
  }
}
