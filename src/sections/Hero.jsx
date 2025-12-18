import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CONTACT } from "../data/content";

export default function Hero() {
  const [years, setYears] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 7;
    const duration = 1200; // ms
    const stepMs = 16;
    const increment = end / (duration / stepMs);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setYears(end);
        clearInterval(counter);
      } else {
        setYears(Math.floor(start));
      }
    }, stepMs);

    return () => clearInterval(counter);
  }, []);

  return (
    <section className="relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_0%,rgba(249,115,22,0.18),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-14 relative">
        <div className="min-h-[70vh] sm:min-h-[78vh] flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-xs tracking-widest text-zinc-400">
              SOLUÇÕES TÉRMICAS INTELIGENTES
            </p>

            <h1 className="mt-3 font-bold text-white leading-[1.05] text-[clamp(30px,7vw,56px)]">
              Ventlize Ar-condicionado
            </h1>

            <p className="mt-4 max-w-xl text-zinc-300">
              Instalação, manutenção, higienização e PMOC com foco em segurança,
              conforto e qualidade do ar.
            </p>

            <motion.div
              className="mt-7 grid gap-3 sm:flex sm:flex-row"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
              }}
            >
              <motion.a
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                href={`https://wa.me/${CONTACT.phoneDigits}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Solicitar orçamento
              </motion.a>

              <motion.a
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=ventlize@outlook.com`}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enviar e-mail
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right metric (igual ideia do +2 milhões) */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center md:justify-end"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div className="reveal md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0 z-10">
              <div className="floating-metric">
                <div className="metric-number">+{years} anos</div>
                <div className="metric-label">de experiência</div>
                <div className="metric-detail">em projetos reais</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
