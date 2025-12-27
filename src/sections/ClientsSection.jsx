import { useState } from "react";
import { CLIENTS } from "../data/content";
import ImageModal from "../components/ImageModal";
import Reveal from "../components/Reveal";

export default function ClientsSection({ variant = "dark" }) {
  const [selected, setSelected] = useState(null);
  const isLight = variant === "light";

  const titleClass = isLight ? "text-zinc-900" : "text-white";
  const subClass = isLight ? "text-zinc-700" : "text-zinc-300";

  const cardClass = isLight
    ? "border-zinc-200 bg-white text-zinc-900"
    : "border-white/10 bg-white/5 text-zinc-200";

  return (
    <Reveal>
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h2 className={`text-2xl font-bold ${titleClass}`}>Clientes atendidos</h2>
      <p className={`mt-2 ${subClass}`}>Alguns negócios que já receberam nossos serviços.</p>

 <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CLIENTS.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setSelected(c)}
            className={`rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 text-left transition hover:-translate-y-0.5 hover:bg-white/10 ${cardClass}`}
          >
            <div className="h-10 w-10 rounded-xl bg-zinc-900/10 grid place-items-center overflow-hidden">
              {c.logo ? (
                <img src={c.logo} alt={`${c.name} logo`} className="h-10 w-10 object-contain" loading="lazy" />
              ) : (
                <span className="text-xs text-zinc-500">Logo</span>
              )}
            </div>

            <div className="text-center text-base sm:text-lg font-normal leading-snug">
              {c.name}
            </div>
          </button>
        ))}
      </div>

<ImageModal
  open={!!selected}
  onClose={() => setSelected(null)}
  title={selected?.name}
  items={selected?.media || []}     // <- passa o array
  initialIndex={0}
  videos={(selected?.media || []).filter((url) =>
    url.includes("youtube.com/embed")
  )}
/>

    </section>
    </Reveal>
  );
}
