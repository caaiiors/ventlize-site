import { DIFFERENTIALS, PMOC_INFO } from "../data/content";
import Reveal from "../components/Reveal";

export default function PMOCSection() {
  return (
    <Reveal>
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-white">PMOC</h2>
        <p className="mt-2 text-zinc-300">
          Plano de Manutenção, Operação e Controle para ambientes climatizados.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PMOC_INFO.map((b) => (
            <div key={b.title} className="rounded-2xl border border-white/10 bg-zinc-950/30 p-5">
              <div className="text-sm font-semibold text-white">{b.title}</div>
              <div className="mt-2 text-sm text-zinc-300">{b.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-white">Diferenciais</div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {DIFFERENTIALS.map((d) => (
              <li key={d} className="flex gap-2 text-sm text-zinc-300">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
    </Reveal>
  );
}
