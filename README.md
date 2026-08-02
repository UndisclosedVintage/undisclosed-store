# Undisclosed Vintage — tienda en línea

Sitio construido con Next.js 15 (React) + Tailwind CSS. Catálogo, carrito
("expediente") y checkout con Mercado Pago (Checkout Pro).

## Qué ya funciona

- Catálogo con filtro por categoría (`/catalogo`)
- Ficha de producto con el sistema real de QC de 5 criterios (`/catalogo/[slug]`)
- Carrito persistente en el navegador (`/carrito`)
- Checkout que crea una preferencia de pago en Mercado Pago y redirige a su
  página de pago hospedada — nunca tocas datos de tarjetas directamente
  (`/checkout` → `/api/crear-preferencia`)
- Página de confirmación (`/gracias`)
- 14 piezas de ejemplo en `lib/products.ts` para que el sitio se vea completo
  desde ya — hay que reemplazarlas por tu catálogo real (ver abajo)

## Correr en tu computadora

Necesitas [Node.js](https://nodejs.org) instalado (versión 20 o más reciente).

```bash
npm install
npm run dev
```

Abre http://localhost:3000

Sin `BLOB_READ_WRITE_TOKEN` configurado, verás el catálogo de ejemplo pero
el panel `/admin` no podrá guardar piezas nuevas — para probarlo en local
copia el token desde tu proyecto de Vercel (ver sección del panel, abajo)
a tu `.env.local`.

## Conectar Mercado Pago

1. Entra a tu panel de desarrolladores de Mercado Pago:
   https://www.mercadopago.com.mx/developers/panel/app
2. Crea una aplicación y copia el **Access Token de producción**
   (hay uno de prueba también, útil mientras pruebas sin cobrar de verdad).
3. Copia `.env.example` a `.env.local` y pega el token:

   ```
   MERCADOPAGO_ACCESS_TOKEN=tu_token_aqui
   ```

4. Reinicia `npm run dev`. El botón de checkout ya va a crear pagos reales
   (o de prueba, si usaste el token de prueba).

**Nunca subas `.env.local` a GitHub** — ya está en `.gitignore`.

## Panel para subir prendas (`/admin`)

Ya no hace falta tocar código para agregar piezas. Flujo pensado para lo
que ya hacen para el QC:

1. Le quitas el fondo a la foto en **Photoroom** (o cualquier app similar) y
   la dejas con fondo blanco.
2. Entras a `tudominio.com/admin` — te va a pedir usuario y contraseña (los
   que pongas en `ADMIN_USUARIO` / `ADMIN_PASSWORD`, ver abajo).
3. Click en "+ agregar pieza", subes la foto, llenas nombre, categoría,
   precio, talla, época, origen, descripción y las 5 calificaciones QC
   (0–10, igual que en el grupo). Guardar.
4. La pieza aparece de inmediato en el catálogo público.
5. Cuando se vende una pieza, en `/admin` hay un botón "marcar vendida"
   por cada una — desaparece la opción de comprarla pero sigue en el
   archivo.

### Configurarlo (una sola vez)

1. En tu proyecto de Vercel: **Storage → Create Database → Blob**. Esto
   guarda tanto las fotos como el catálogo mismo — no necesitas contratar
   una base de datos aparte. Vercel agrega automáticamente la variable
   `BLOB_READ_WRITE_TOKEN` a tu proyecto.
2. En **Settings → Environment Variables**, agrega también:
   - `ADMIN_USUARIO` — el usuario para entrar al panel
   - `ADMIN_PASSWORD` — la contraseña
3. Vuelve a desplegar el sitio para que tomen efecto.

Nota: esta protección con usuario/contraseña es intencionalmente simple —
suficiente para que solo el equipo suba piezas, pero no la reutilices como
contraseña de nada más sensible.

Las 14 piezas de ejemplo en `lib/products.ts` solo se usan como catálogo
de respaldo mientras no hayas subido nada real desde el panel — en cuanto
agregues tu primera pieza, el catálogo real (guardado en Blob) toma el
control.

## Desplegar (dominio y hosting)

1. Sube este proyecto a un repositorio de GitHub.
2. Entra a https://vercel.com, conecta tu cuenta de GitHub e importa el
   repositorio. Vercel detecta Next.js automáticamente.
3. En "Environment Variables" de Vercel, agrega `MERCADOPAGO_ACCESS_TOKEN`
   y `NEXT_PUBLIC_SITE_URL` (esta última con tu dominio final).
4. Compra tu dominio (Namecheap, GoDaddy, Don Dominio, etc.) y apúntalo a
   Vercel desde "Domains" en el proyecto — Vercel te da instrucciones
   exactas para tu proveedor.

El plan gratuito de Vercel cubre perfectamente el tráfico de una tienda de
este tamaño para empezar.

## Antes de vender de verdad — pendientes recomendados

- Páginas de **Política de envíos**, **Devoluciones** y **Aviso de
  privacidad** — recomendable para cualquier tienda en línea en México.
  No las incluí porque las políticas reales (tiempos, costos, condiciones)
  las tienen que definir ustedes.
- Probar el flujo completo con el token de **prueba** de Mercado Pago
  antes de cambiar al de producción.
- Reemplazar los textos de WhatsApp/Instagram en `/contacto` por los
  reales.

## Estructura del proyecto

```
app/                 páginas (App Router de Next.js)
  admin/                   panel para subir y gestionar piezas (protegido)
  api/crear-preferencia/   ruta que crea el pago en Mercado Pago
  api/productos/           ruta que usa el panel para guardar/actualizar piezas
  catalogo/[slug]/         ficha de producto
components/           piezas de UI reutilizables
lib/products.ts        catálogo de ejemplo (respaldo hasta que subas piezas reales)
lib/products-store.ts  catálogo real: lee/escribe en Vercel Blob
lib/cart-context.tsx   lógica del carrito
middleware.ts          protige /admin y /api/productos con usuario/contraseña
```
