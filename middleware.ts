import { NextResponse, type NextRequest } from "next/server";

// Protege /admin y las APIs de administración con usuario y contraseña
// (autenticación básica). Define ADMIN_USUARIO y ADMIN_PASSWORD en Vercel.
// Si no están definidas, el panel queda cerrado por completo.

function igual(a: string, b: string) {
  // Comparación de tiempo constante para no filtrar información
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function middleware(req: NextRequest) {
  const usuario = process.env.ADMIN_USUARIO;
  const clave = process.env.ADMIN_PASSWORD;

  if (!usuario || !clave) {
    return new NextResponse(
      "Panel cerrado: falta configurar ADMIN_USUARIO y ADMIN_PASSWORD.",
      { status: 503 }
    );
  }

  const cabecera = req.headers.get("authorization") ?? "";
  if (cabecera.startsWith("Basic ")) {
    try {
      const credenciales = atob(cabecera.slice(6));
      const i = credenciales.indexOf(":");
      if (i > -1) {
        const u = credenciales.slice(0, i);
        const p = credenciales.slice(i + 1);
        if (igual(u, usuario) && igual(p, clave)) return NextResponse.next();
      }
    } catch {
      // credenciales mal formadas: cae en el 401
    }
  }

  return new NextResponse("Se requiere autenticación.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Undisclosed admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/productos/:path*", "/api/posts/:path*"],
};
