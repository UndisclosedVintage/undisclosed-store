import { NextResponse } from "next/server";
import Stripe from "stripe";
import { resolverCarrito } from "@/lib/checkout";
import { folioVisible } from "@/lib/products";
import { guardarPedido } from "@/lib/pedidos";
import { site } from "@/lib/site-config";

// Pago en dólares (envíos internacionales) con Stripe Checkout.
// Stripe recoge la dirección y el teléfono en su propia página.

// Países a los que se envía. Edita la lista para abrir o cerrar destinos.
const PAISES = [
  "US", "CA", "GB", "ES", "FR", "DE", "IT", "NL", "PT", "AU", "JP",
] as const;

export async function POST(req: Request) {
  const clave = process.env.STRIPE_SECRET_KEY;
  if (!clave) {
    return NextResponse.json(
      { error: "El pago con tarjeta en USD todavía no está configurado." },
      { status: 503 }
    );
  }

  let cuerpo: { slugs?: unknown };
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const slugs = Array.isArray(cuerpo.slugs)
    ? cuerpo.slugs.filter((s): s is string => typeof s === "string")
    : [];

  const carrito = await resolverCarrito(slugs, "USD");
  if (!carrito.ok) {
    return NextResponse.json({ error: carrito.error }, { status: carrito.status });
  }

  const base = (process.env.NEXT_PUBLIC_SITE_URL || site.dominio).replace(/\/$/, "");

  const referencia = crypto.randomUUID();

  try {
    // Se guarda antes de ir a pagar; los datos de envío los pone el aviso de
    // Stripe cuando el pago se confirma (Stripe los pide en su propia página).
    await guardarPedido({
      referencia,
      metodo: "stripe",
      moneda: "USD",
      estado: "pendiente",
      creadoEn: new Date().toISOString(),
      comprador: {
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        estado: "",
        cp: "",
      },
      piezas: carrito.lineas.map((l) => ({
        slug: l.producto.slug,
        nombre: l.producto.nombre,
        folio: folioVisible(l.producto.lote),
        precio: l.precio,
      })),
      envio: carrito.envio,
      total: carrito.total,
    });

    const stripe = new Stripe(clave);
    const sesion = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: carrito.lineas.map((l) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(l.precio * 100),
          product_data: {
            name: l.titulo.slice(0, 250),
            ...(l.producto.imagenes?.[0] && /^https:\/\//.test(l.producto.imagenes[0])
              ? { images: [l.producto.imagenes[0]] }
              : {}),
          },
        },
      })),
      shipping_address_collection: { allowed_countries: [...PAISES] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Envío internacional",
            fixed_amount: {
              amount: Math.round(carrito.envio * 100),
              currency: "usd",
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      client_reference_id: referencia,
      metadata: {
        referencia,
        folios: carrito.lineas.map((l) => folioVisible(l.producto.lote)).join(","),
      },
      success_url: `${base}/gracias`,
      cancel_url: `${base}/checkout`,
    });

    if (!sesion.url) throw new Error("Stripe no devolvió una URL de pago.");
    return NextResponse.json({ url: sesion.url });
  } catch (err) {
    console.error("Stripe:", err);
    return NextResponse.json(
      { error: "No pudimos iniciar el pago con tarjeta. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
