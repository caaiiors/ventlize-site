import { SERVICES } from "../data/content";
import { cn } from "../lib/cn";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal";

export default function ServicesGrid({ variant = "dark" }) {
  const isLight = variant === "light";

  const title = cn("text-2xl font-bold", isLight ? "text-zinc-900" : "text-white");
  const sub = cn("mt-2", isLight ? "text-zinc-700" : "text-zinc-300");

  const card = cn(
    "rounded-2xl border p-5 transition",
    isLight ? "border-zinc-200 bg-white hover:bg-zinc-50" : "border-white/10 bg-white/5 hover:bg-white/10"
  );

  const cardTitle = cn("text-sm font-semibold", isLight ? "text-zinc-900" : "text-white");
  const cardDesc = cn("mt-2 text-sm", isLight ? "text-zinc-700" : "text-zinc-300");

  return (
    <Reveal>
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className={title}>Serviços</h2>
      <p className={sub}>Do projeto à manutenção: foco em desempenho, qualidade e durabilidade.</p>

      <motion.div
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {SERVICES.map((s) => (
          <motion.div
            key={s.title}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={card}
            whileHover={{ y: -3 }}
          >
            <div className={cardTitle}>{s.title}</div>
            <div className={cardDesc}>{s.desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
    </Reveal>
  );
}
