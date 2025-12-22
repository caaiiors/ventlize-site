import { useState } from "react";
import { PORTFOLIO_PLACEHOLDERS } from "../data/content";
import ImageModal from "../components/ImageModal";

export default function PortfolioGrid() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PORTFOLIO_PLACEHOLDERS.map((p) => (
          <button
            key={p.title}
            type="button"
            onClick={() => setSelected(p)}
            className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden text-left transition hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="aspect-[4/3] w-full bg-zinc-900/60 overflow-hidden">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              )}
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-zinc-300">{p.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <ImageModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        src={selected?.image}
        description={selected?.desc}
      />
    </section>
  );
}
