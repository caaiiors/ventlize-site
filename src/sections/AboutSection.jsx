import { ABOUT } from "../data/content";
import { cn } from "../lib/cn";
import Reveal from "../components/Reveal";

export default function AboutSection({ variant = "dark" }) {
  const isLight = variant === "light";

  const title = cn("text-2xl font-bold", isLight ? "text-zinc-900" : "text-white");
  const card = cn(
    "rounded-2xl border p-5",
    isLight ? "border-zinc-200 bg-zinc-50" : "border-white/10 bg-white/5"
  );
  const text = cn("text-sm", isLight ? "text-zinc-700" : "text-zinc-300");

  return (
    <Reveal>
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h2 className={title}>{ABOUT.title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {ABOUT.bullets.map((b) => (
          <div key={b} className={card}>
            <div className={cn("flex gap-3", text)}>
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              <span>{b}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
    </Reveal>
  );
}
