import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const usuario = process.env.ADMIN_USUARIO;
  const clave = process.env.ADMIN_PASSWORD;

  if (!usuario || !clave) {
    return new NextResponse(
      "Panel no configurado: falta ADMIN_USUARIO / ADMIN_PASSWORD. Ver README.md.",
      { status: 500 }
    );
  }

  const auth = req.headers.get("authorization");
  if (auth) {
    const [, base64 = ""] = auth.split(" ");
    const [u, p] = Buffer.from(base64, "base64").toString().split(":");
    if (u === usuario && p === clave) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Panel Undisclosed"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/productos/:path*"],
};
