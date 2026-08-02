export default function Footer() {
  return (
    <footer className="bg-blackout text-paper/70 mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="tab-label text-paper text-base mb-2">undisclosed.</p>
          <p className="font-serif leading-relaxed">
            Ropa vintage seleccionada pieza por pieza en Colonia Americana,
            Guadalajara.
          </p>
        </div>
        <div>
          <p className="tab-label text-xs uppercase text-paper mb-2">
            visítanos
          </p>
          <p className="font-serif leading-relaxed">
            Colonia Americana
            <br />
            Guadalajara, Jalisco
          </p>
        </div>
        <div>
          <p className="tab-label text-xs uppercase text-paper mb-2">
            síguenos
          </p>
          <p className="font-serif leading-relaxed">
            Contenido y piezas nuevas cada semana en Instagram y TikTok.
          </p>
        </div>
      </div>
      <div className="perforated border-paper/20 max-w-5xl mx-auto px-4 sm:px-6 py-4 text-xs font-mono text-paper/40">
        undisclosed vintage — expediente digital
      </div>
    </footer>
  );
}
