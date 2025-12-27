import { useEffect, useState } from "react";
import { PORTFOLIO_PLACEHOLDERS } from "../data/content";
import ImageModal from "../components/ImageModal";

export default function PortfolioGrid() {
  const [selected, setSelected] = useState(null); // { title, type, src, desc }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-bold text-white">Portfólio</h2>
      <p className="mt-2 text-zinc-300">
        Serviços executados em ambientes residenciais e comerciais.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PORTFOLIO_PLACEHOLDERS.map((p, index) => (
          <PortfolioCard
            key={p.title}
            item={p}
            index={index}
            onOpen={(payload) => setSelected(payload)}
          />
        ))}
      </div>

      {/* Modal genérico para imagem OU vídeo */}
      <ImageModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        description={selected?.desc}
        items={selected?.items || []}
        initialIndex={selected?.index || 0}
        videos={selected?.videos || []}
      />
    </section>
  );
}

function PortfolioCard({ item, index, onOpen }) {
  const { title, desc, images = [], videos = [] } = item;
  const [currentIndex, setCurrentIndex] = useState(0);
  const media = [...images, ...videos]; // primeiro imagens, depois vídeos

  // autoplay de 3 em 3 segundos
  useEffect(() => {
    if (media.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 3000);
    return () => clearInterval(id);
  }, [media.length]);

  const currentSrc = media[currentIndex];
  const isVideo = videos.includes(currentSrc);

  // ao clicar no card, abre modal com o item atual
const handleOpen = () => {
  if (!currentSrc) return;
  onOpen({
    title,
    desc,
    items: media,           // array com imagens + vídeos
    index: currentIndex,    // slide atual
    videos,                 // pra saber quais são vídeos
  });
};

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden text-left transition hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="aspect-[4/3] w-full bg-zinc-900/60 overflow-hidden relative">
        {/* imagem de fundo do card (sempre imagem; para vídeo, mostra thumb do próprio vídeo ou uma imagem do Drive) */}
        {currentSrc && (
          <img
            src={currentSrc}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}

        {/* badge de vídeo quando o slide atual é um vídeo */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900">
              ▶ Vídeo
            </span>
          </div>
        )}

        {/* indicadores de slide */}
        {media.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-3 rounded-full ${
                  idx === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-zinc-300">{desc}</p>
      </div>
    </button>
  );
}
