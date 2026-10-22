import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { resolverCarrito } from "@/lib/checkout";
import { folioVisible } from "@/lib/products";
import { site } from "@/lib/site-config";

// Pago en pesos mexicanos con Mercado Pago (Checkout Pro).
// Los precios y el envío se calculan aquí, nunca con lo que manda el navegador.

const texto = (v: unknown, max = 120) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "El pago con Mercado Pago todavía no está configurado." },
      { status: 503 }
    );
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const slugs = Array.isArray(cuerpo.slugs)
    ? cuerpo.slugs.filter((s): s is string => typeof s === "string")
    : [];

  const comprador = {
    nombre: texto(cuerpo.nombre),
    email: texto(cuerpo.email),
    telefono: texto(cuerpo.telefono, 30),
    direccion: texto(cuerpo.direccion, 200),
    ciudad: texto(cuerpo.ciudad),
    estado: texto(cuerpo.estado),
    cp: texto(cuerpo.cp, 10),
  };

  if (
    !comprador.nombre ||
    !/^\S+@\S+\.\S+$/.test(comprador.email) ||
    !comprador.telefono ||
    !comprador.direccion ||
    !comprador.ciudad ||
    !comprador.estado ||
    !/^\d{5}$/.test(comprador.cp)
  ) {
    return NextResponse.json(
      { error: "Revisa tus datos de envío: hay campos vacíos o inválidos." },
      { status: 400 }
    );
  }

  const carrito = await resolverCarrito(slugs, "MXN");
  if (!carrito.ok) {
    return NextResponse.json({ error: carrito.error }, { status: carrito.status });
  }

  const base = (process.env.NEXT_PUBLIC_SITE_URL || site.dominio).replace(/\/$/, "");
  const referencia = crypto.randomUUID();
  const [nombrePila, ...resto] = comprador.nombre.split(/\s+/);

  const items = [
    ...carrito.lineas.map((l) => ({
      id: l.producto.slug,
      title: l.titulo.slice(0, 250),
      quantity: 1,
      unit_price: l.precio,
      currency_id: "MXN",
    })),
    {
      id: "envio",
      title: "Envío nacional",
      quantity: 1,
      unit_price: carrito.envio,
      currency_id: "MXN",
    },
  ];

  try {
    const cliente = new MercadoPagoConfig({ accessToken: token });
    const preferencia = await new Preference(cliente).create({
      body: {
        items,
        payer: {
          name: nombrePila,
          surname: resto.join(" "),
          email: comprador.email,
          phone: { number: comprador.telefono },
          address: { street_name: comprador.direccion, zip_code: comprador.cp },
        },
        back_urls: {
          success: `${base}/gracias`,
          pending: `${base}/gracias`,
          failure: `${base}/checkout`,
        },
        ...(base.startsWith("https://") ? { auto_return: "approved" as const } : {}),
        external_reference: referencia,
        statement_descriptor: "UNDISCLOSED",
        metadata: {
          folios: carrito.lineas.map((l) => folioVisible(l.producto.lote)).join(","),
          envio_a: `${comprador.direccion}, ${comprador.ciudad}, ${comprador.estado}, CP ${comprador.cp}`,
          telefono: comprador.telefono,
        },
      },
    });

    if (!preferencia.init_point) {
      throw new Error("Mercado Pago no devolvió una URL de pago.");
    }
    return NextResponse.json({ url: preferencia.init_point });
  } catch (err) {
    console.error("Mercado Pago:", err);
    return NextResponse.json(
      { error: "No pudimos iniciar el pago con Mercado Pago. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
