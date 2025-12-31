import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ImageModal({
  open,
  onClose,
  title,
  description,
  items = [],
  initialIndex = 0,
  videos = [],
}) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  // Navegação por teclado
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }

    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, index, items.length]); // Adicionei dependências para garantir estado atualizado

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

  // Lógica do Swipe (Arrastar)
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50; // Pixels necessários para considerar um swipe
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header Mobile */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none">
            <h3 className="text-white font-medium text-lg text-center pointer-events-auto">
              {title}
            </h3>
          </div>

          {/* Área Principal */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar na área da imagem
          >
            <AnimatePresence initial={false} mode="wait">
              {current && (
                <motion.div
                  key={index} // Essencial para o Framer Motion saber que o item mudou
                  
                  // Propriedades de Arrastar (Swipe)
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  
                  // Animação de entrada/saída
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  
                  className="absolute w-full h-full flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
                >
                  {isVideo ? (
                    <div className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
                        {/* Overlay transparente para permitir o drag sobre o iframe */}
                        <div className="absolute inset-0 z-10 bg-transparent" /> 
                        <iframe
                        src={current}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        />
                    </div>
                  ) : (
                    <img
                      src={current}
                      alt={title}
                      className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
                      draggable="false" // Desabilita drag nativo do navegador
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Setas de Navegação (Desktop/Fallback) */}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 md:left-8 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-sm border border-white/10 hidden md:block"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 md:right-8 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-sm border border-white/10 hidden md:block"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Indicador de posição */}
                <div className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white/90 text-sm backdrop-blur-sm border border-white/10 z-50 pointer-events-none">
                  {index + 1} / {items.length}
                </div>
              </>
            )}
          </div>

          {/* Footer Descrição */}
          {description && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-6 border-t border-white/10 z-50">
              <div className="max-w-4xl mx-auto">
                <p className="text-white/90 text-center leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
