import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { obtenerProductoPorSlug } from "@/lib/products-store";

interface ItemCarrito {
  slug: string;
}

interface Comprador {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          "Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno. Ver README.md.",
      },
      { status: 500 }
    );
  }

  const body = (await req.json()) as {
    items: ItemCarrito[];
    comprador: Comprador;
  };

  if (!body.items?.length) {
    return NextResponse.json(
      { error: "El expediente está vacío." },
      { status: 400 }
    );
  }

  // Los precios SIEMPRE se resuelven en el servidor a partir del catálogo,
  // nunca se confía en el precio que manda el navegador.
  const itemsValidados = [];
  for (const { slug } of body.items) {
    const producto = await obtenerProductoPorSlug(slug);
    if (!producto) {
      return NextResponse.json(
        { error: `La pieza ${slug} ya no está disponible.` },
        { status: 400 }
      );
    }
    if (!producto.stock) {
      return NextResponse.json(
        { error: `"${producto.nombre}" ya se vendió.` },
        { status: 409 }
      );
    }
    itemsValidados.push({
      id: producto.slug,
      title: `${producto.nombre} (talla ${producto.talla}, lote ${producto.lote})`,
      quantity: 1,
      unit_price: producto.precio,
      currency_id: "MXN",
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  try {
    const resultado = await preference.create({
      body: {
        items: itemsValidados,
        payer: {
          name: body.comprador?.nombre,
          email: body.comprador?.email,
          phone: { number: body.comprador?.telefono },
        },
        back_urls: {
          success: `${siteUrl}/gracias`,
          failure: `${siteUrl}/checkout`,
          pending: `${siteUrl}/gracias`,
        },
        auto_return: "approved",
        statement_descriptor: "UNDISCLOSED VTG",
        metadata: {
          direccion_envio: body.comprador?.direccion,
        },
      },
    });

    return NextResponse.json({ init_point: resultado.init_point });
  } catch (err) {
    console.error("Error creando preferencia de Mercado Pago:", err);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
