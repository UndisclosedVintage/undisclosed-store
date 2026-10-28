# Undisclosed Vintage — tienda en línea

Next.js 15 + Tailwind. Se publica en Vercel desde este repositorio de GitHub.

## Qué incluye
- Portada editorial, **New arrivals**, catálogo con filtros (talla, época, medida de pecho), orden y vista de 2/3/4 columnas.
- Selector de moneda **MXN / USD** (el precio en USD se escribe a mano en cada pieza).
- "Tu selección" (carrito) y pago: **Mercado Pago** para MXN y **Stripe** para USD.
- **El fit perfecto** (guía de medidas para tops y bottoms), **Vende tus piezas** (consigna), **FAQ**, **Blog**, Nosotros y Contacto.
- Cursor personalizado (solo con mouse).
- Panel de administración en `/admin` para subir, editar, marcar como vendidas y eliminar piezas, y para escribir artículos.
- **Archivo** (`/archivo`): las piezas marcadas como vendidas quedan ahí como registro fotográfico. Para borrar una pieza por error o de prueba usa "eliminar"; para una pieza vendida usa "marcar vendida", así se conserva en el archivo.

## Variables de entorno (Vercel → Settings → Environment Variables)
Ver `.env.example`. Después de agregarlas, haz **Redeploy**.

| Variable | Para qué |
|---|---|
| `ADMIN_USUARIO`, `ADMIN_PASSWORD` | Entrar a `/admin`. Sin ellas el panel queda cerrado. |
| `BLOB_READ_WRITE_TOKEN` | Guardar fotos, catálogo y blog (Vercel → Storage → Create → Blob, y conéctalo al proyecto). |
| `MERCADOPAGO_ACCESS_TOKEN` | Cobrar en MXN. También permite confirmar los pagos automáticamente (webhook). |
| `RESEND_API_KEY` | (Opcional) Correo de aviso por cada pedido pagado. |
| `STRIPE_SECRET_KEY` | Cobrar en USD. |
| `NEXT_PUBLIC_SITE_URL` | `https://undisclosedvintage.com` (regresos del pago y sitemap). |

Mientras no conectes Blob, el sitio muestra 14 piezas de ejemplo. Al conectarlo, solo verás lo que subas desde `/admin`.

## Dónde cambiar cosas
- **Colores:** `app/globals.css` (bloque `:root`).
- **Tipografías:** `lib/fuentes.ts` (títulos Instrument Serif, texto Inter Tight, etiquetas IBM Plex Mono).
- **Datos de la tienda** (WhatsApp, Instagram, correo, fotos editoriales, aviso de "no devoluciones"): `lib/site-config.ts`. Lo vacío no se muestra.
- **Envíos:** `lib/envio.ts` (escalones por número de piezas).
- **Textos de El fit perfecto:** `lib/guia-tallas.ts`.
- **Logos:** `public/brand/`.
- **Fotos editoriales de la portada:** súbelas a `public/editorial/` y escribe sus rutas en `site.editorial`.

## Limitaciones conocidas
- Una pieza **no se marca como vendida sola** al pagar (haría falta webhooks). Hay que marcarla en `/admin`.
- El aviso de devoluciones es un borrador: que lo revise alguien que conozca derecho del consumidor en México.
- Los escalones de envío y el monto de envío en USD son provisionales.
- El sitio está en español; "New arrivals", "T-Shirts", "Outerwear" y "Bottoms" se dejaron en inglés como nombres de sección.

## Desarrollo local
```bash
npm install
npm run dev
```
