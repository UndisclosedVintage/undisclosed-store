import { listarPedidos, type EstadoPedido } from "@/lib/pedidos";
import { formatear } from "@/lib/moneda";

export const dynamic = "force-dynamic";

const ETIQUETA: Record<EstadoPedido, { texto: string; clase: string }> = {
  pagado: { texto: "Pagado", clase: "bg-verde/60" },
  pendiente: { texto: "Sin pagar", clase: "bg-ink/10" },
  revisar: { texto: "Revisar", clase: "bg-stamp text-paper" },
};

export default async function Pedidos() {
  const pedidos = await listarPedidos();
  const pagados = pedidos.filter((p) => p.estado !== "pendiente");
  const abandonados = pedidos.filter((p) => p.estado === "pendiente");

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-3 font-display text-3xl">
          Pedidos{" "}
          <span className="tab-label text-sm text-ink/50">({pagados.length})</span>
        </h2>
        {pagados.length === 0 ? (
          <p className="font-serif text-ink/65">
            Todavía no hay pedidos pagados. Cuando alguien pague, aparece aquí con
            sus datos de envío.
          </p>
        ) : (
          <ul className="space-y-4">
            {pagados.map((p) => (
              <li key={p.referencia} className="manila-card p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className={`tab-label rounded-sm px-2 py-0.5 text-[11px] uppercase ${ETIQUETA[p.estado].clase}`}
                  >
                    {ETIQUETA[p.estado].texto}
                  </span>
                  <span className="tab-label text-[11px] uppercase text-ink/55">
                    {new Date(p.pagadoEn ?? p.creadoEn).toLocaleString("es-MX", {
                      timeZone: "America/Mexico_City",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {" · "}
                    {p.metodo === "stripe" ? "Stripe" : "Mercado Pago"}
                  </span>
                  <span className="ml-auto font-mono">{formatear(p.total, p.moneda)}</span>
                </div>

                {p.nota && (
                  <p className="mt-2 border border-stamp bg-stamp/10 p-2 font-serif text-sm">
                    {p.nota}
                  </p>
                )}

                <ul className="mt-3 font-serif text-sm">
                  {p.piezas.map((x) => (
                    <li key={x.slug}>
                      {x.folio} · {x.nombre} · {formatear(x.precio, p.moneda)}
                    </li>
                  ))}
                  <li className="text-ink/60">Envío · {formatear(p.envio, p.moneda)}</li>
                </ul>

                <div className="mt-3 font-serif text-sm text-ink/80">
                  <p className="font-medium">{p.comprador.nombre}</p>
                  <p>{p.comprador.direccion}</p>
                  <p>
                    {p.comprador.ciudad}, {p.comprador.estado} {p.comprador.cp}
                    {p.comprador.pais ? `, ${p.comprador.pais}` : ""}
                  </p>
                  <p>
                    {p.comprador.telefono} ·{" "}
                    <a className="underline" href={`mailto:${p.comprador.email}`}>
                      {p.comprador.email}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {abandonados.length > 0 && (
        <section>
          <h2 className="mb-1 font-display text-2xl">
            Sin pagar{" "}
            <span className="tab-label text-sm text-ink/50">({abandonados.length})</span>
          </h2>
          <p className="mb-3 font-serif text-sm text-ink/60">
            Personas que llegaron a Mercado Pago pero no terminaron de pagar (o aún
            no se confirma). No se apartó ninguna pieza.
          </p>
          <ul className="divide-y divide-ink/15 border-y border-ink/15 font-serif text-sm">
            {abandonados.map((p) => (
              <li key={p.referencia} className="py-2">
                {new Date(p.creadoEn).toLocaleString("es-MX", {
                  timeZone: "America/Mexico_City",
                  dateStyle: "short",
                  timeStyle: "short",
                })}
                {" · "}
                {p.comprador.nombre || "sin datos"} · {p.piezas.map((x) => x.folio).join(", ")} ·{" "}
                {formatear(p.total, p.moneda)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
