import { motion } from "framer-motion";
import { CONTACT } from "../data/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_0%,rgba(249,115,22,0.18),transparent_55%)]" />

      <motion.div
        className="mx-auto max-w-6xl px-4 py-14 sm:py-18 relative"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.p
          className="text-xs tracking-widest text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          SOLUÇÕES TÉRMICAS INTELIGENTES
        </motion.p>

        <motion.h1
          className="mt-3 text-3xl sm:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.65 }}
        >
          Ventlize Ar-condicionado
        </motion.h1>

        <motion.p
          className="mt-4 max-w-2xl text-zinc-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Instalação, manutenção, higienização e PMOC com foco em segurança, conforto e qualidade do ar.
        </motion.p>

        <motion.div
          className="mt-7 flex flex-col gap-3 sm:flex-row"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.38 },
            },
          }}
        >
          <motion.a
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            href={`https://wa.me/${CONTACT.phoneDigits}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Solicitar orçamento
          </motion.a>

          <motion.a
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enviar e-mail
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
