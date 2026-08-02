export default function Contacto() {
  return (
    <div className="py-10 max-w-lg">
      <p className="tab-label text-xs uppercase text-ink/50 mb-2">
        expediente 001 · contacto
      </p>
      <h1 className="font-serif text-3xl mb-6">Contacto</h1>

      <div className="manila-card rounded-sm p-6 space-y-4 font-serif">
        <div>
          <p className="tab-label text-[11px] uppercase text-ink/50">
            Tienda
          </p>
          <p>Colonia Americana, Guadalajara, Jalisco</p>
        </div>
        <div>
          <p className="tab-label text-[11px] uppercase text-ink/50">
            WhatsApp
          </p>
          <p className="text-ink/60">Agrega tu número de contacto aquí.</p>
        </div>
        <div>
          <p className="tab-label text-[11px] uppercase text-ink/50">
            Instagram
          </p>
          <p className="text-ink/60">Agrega tu usuario aquí.</p>
        </div>
      </div>
    </div>
  );
}
