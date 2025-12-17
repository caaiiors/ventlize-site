import { CONTACT } from "../data/content";
import { cn } from "../lib/cn";
import { motion } from "framer-motion";

export default function ContactCTA({ variant = "dark" }) {
  const isLight = variant === "light";

  const wrapper = cn(
    "rounded-3xl border p-6 sm:p-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between",
    isLight ? "border-zinc-200 bg-white" : "border-white/10 bg-white/5"
  );

  const title = cn("text-xl font-bold", isLight ? "text-zinc-900" : "text-white");
  const sub = cn("mt-2", isLight ? "text-zinc-700" : "text-zinc-300");

  const meta = cn("mt-4 space-y-1 text-sm", isLight ? "text-zinc-700" : "text-zinc-300");
  const metaLabel = cn("text-sm", isLight ? "text-zinc-500" : "text-zinc-400");
  const link = cn("hover:underline", isLight ? "text-zinc-900" : "text-white");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <motion.div
        className={wrapper}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div>
          <h3 className={title}>Fale com a Ventlize</h3>
          <p className={sub}>Orçamentos e atendimentos via WhatsApp, e-mail e Instagram.</p>

          <div className={meta}>
            <div>
              <span className={metaLabel}>Telefone:</span> {CONTACT.phoneDisplay}
            </div>
            <div>
              <span className={metaLabel}>E-mail:</span>{" "}
              <a className={link} href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </div>
            <div>
              <span className={metaLabel}>Instagram:</span>{" "}
              <a className={link} href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
                @{CONTACT.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[260px]">
          <a
            href={`https://wa.me/${CONTACT.phoneDigits}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition"
          >
            Chamar no WhatsApp
          </a>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "rounded-xl px-5 py-3 text-center text-sm font-semibold transition",
              isLight
                ? "border border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100"
                : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
            )}
          >
            Ver Instagram
          </a>
        </div>
      </motion.div>
    </section>
  );
}
