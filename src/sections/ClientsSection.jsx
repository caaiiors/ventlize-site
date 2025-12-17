import { CLIENTS } from "../data/content";
import { cn } from "../lib/cn";

export default function ClientsSection({ variant = "dark" }) {
  const isLight = variant === "light";

  const title = cn("text-2xl font-bold", isLight ? "text-zinc-900" : "text-white");
  const sub = cn("mt-2", isLight ? "text-zinc-700" : "text-zinc-300");

  const chip = cn(
    "rounded-full border px-4 py-2 text-sm",
    isLight ? "border-zinc-200 bg-zinc-50 text-zinc-800" : "border-white/10 bg-white/5 text-zinc-200"
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className={title}>Clientes atendidos</h2>
      <p className={sub}>Alguns negócios que já receberam nossos serviços.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CLIENTS.map((c) => (
          <span key={c} className={chip}>
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}
