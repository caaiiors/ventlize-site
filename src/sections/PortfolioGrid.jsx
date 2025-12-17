import { PORTFOLIO_PLACEHOLDERS } from "../data/content";

export default function PortfolioGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold text-white">Portfólio</h2>
      <p className="mt-2 text-zinc-300">
        Em breve: fotos reais dos serviços (antes/depois) e cases completos.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PORTFOLIO_PLACEHOLDERS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="aspect-[16/10] w-full rounded-xl bg-zinc-800/60 ring-1 ring-white/10" />
            <div className="mt-4 text-sm font-semibold text-white">{p.title}</div>
            <div className="mt-2 text-sm text-zinc-300">{p.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
