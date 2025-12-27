import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ImageModal({
  open,
  onClose,
  title,
  description,
  items = [],       // array de URLs (imagens + vídeos)
  initialIndex = 0,
  videos = [],      // array com URLs que são vídeos (YouTube embed)
}) {
  const [index, setIndex] = useState(initialIndex);

  // sempre que abrir com outro card, sincroniza o índice
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const hasItems = items.length > 0;
  const current = hasItems ? items[index] : null;
  const isVideo = current && videos.includes(current);

  const handleNext = () => {
    if (!hasItems) return;
    setIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    if (!hasItems) return;
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* overlay */}
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            aria-label="Fechar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div className="text-sm font-semibold text-white truncate">
                {title}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
              >
                Fechar
              </button>
            </div>

            {/* conteúdo + setas */}
            <div className="relative bg-black">
              {current && (
                <>
                  {isVideo ? (
                    <div className="relative w-full pt-[56.25%]">
                      <iframe
                        src={current}
                        title={title}
                        className="absolute inset-0 h-full w-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <img
                      src={current}
                      alt={title}
                      className="w-full max-h-[80vh] object-contain"
                      loading="eager"
                    />
                  )}

                  {/* seta esquerda */}
                  {items.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Imagem anterior"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/70"
                      >
                        ‹
                      </button>

                      {/* seta direita */}
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Próxima imagem"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/70"
                      >
                        ›
                      </button>

                      {/* indicador de posição */}
                      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-zinc-100">
                        {index + 1} / {items.length}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {description && (
              <div className="border-t border-white/10 px-4 py-3">
                <p className="text-xs text-zinc-300">{description}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
