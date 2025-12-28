import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import ImageModal from "../components/ImageModal";

export default function PortfolioGrid() {
  const [portfolio, setPortfolio] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPortfolio(data);
    } catch (error) {
      console.error("Erro ao buscar portfólio:", error);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {portfolio.map((item) => (
          <PortfolioCard
            key={item.id}
            item={item}
            onOpen={() => setSelected(item)}
          />
        ))}
      </div>

      {portfolio.length === 0 && (
        <div className="mt-8 text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
      Carregando...
        </div>
      )}

      {/* Modal com Fotos e Vídeos */}
      <ImageModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        items={[...(selected?.images || []), ...(selected?.videos || [])]}
        initialIndex={0}
        description={selected?.description}
        videos={selected?.videos || []}
      />
    </section>
  );
}

// Componente do Card com Carrossel Automático
function PortfolioCard({ item, onOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const media = [...(item.images || []), ...(item.videos || [])];

  // Autoplay de 3 em 3 segundos
  useEffect(() => {
    if (media.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 3000);
    return () => clearInterval(id);
  }, [media.length]);

  const currentSrc = media[currentIndex];
  const isVideo = currentSrc && (item.videos || []).includes(currentSrc);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden text-left transition hover:-translate-y-1 hover:bg-white/10"
    >
      {/* Foto/Vídeo de capa */}
      <div className="aspect-[4/3] w-full bg-zinc-950/30 overflow-hidden relative">
        {currentSrc && (
          <>
            {isVideo ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black/40">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900">
                  ▶ Vídeo
                </span>
              </div>
            ) : (
              <img
                src={currentSrc}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="eager"
                onError={(e) => {
                  console.error("Erro ao carregar imagem:", currentSrc);
                }}
              />
            )}
          </>
        )}

        {/* Indicadores de slide */}
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

      {/* Título e Descrição */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
        <p className="mt-1 text-sm text-zinc-300">{item.description}</p>
      </div>
    </button>
  );
}

