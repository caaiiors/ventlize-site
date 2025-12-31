import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ImageModal from "../components/ImageModal";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ClientsSection() {
  const [selected, setSelected] = useState(null);
  const [clients, setClients] = useState([]);
  
  // Estados e Refs para a animação híbrida (Auto + Drag)
  const [width, setWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);
  const x = useMotionValue(0);
  
  // Configuração da velocidade (ajuste conforme necessário)
  const speed = 0.5; // Pixels por frame (menor = mais lento)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ORDENAÇÃO: Da esquerda pra direita pela maior quantidade de fotos
        const sortedClients = clientsData.sort((a, b) => {
          const countA = a.media ? a.media.length : 0;
          const countB = b.media ? b.media.length : 0;
          return countB - countA;
        });

        setClients(sortedClients);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClients();
  }, []);

  // Calcula a largura total de UM conjunto de itens para saber onde resetar o loop
  useEffect(() => {
    if (carouselRef.current) {
      // O scrollWidth é a largura total dos itens duplicados. 
      // Dividimos por 2 para saber o tamanho do conjunto original.
      setWidth(carouselRef.current.scrollWidth / 2);
    }
  }, [clients]);

  // O Loop de Animação (substitui o animate={{ x: ... }})
  useAnimationFrame(() => {
    if (!width) return;
    
    // Se estiver arrastando, NÃO move automaticamente
    if (isDragging) return;

    // Pega a posição atual
    let currentX = x.get();
    
    // Move para a esquerda
    currentX -= speed;

    // Lógica do Loop Infinito:
    // Se passou da largura de um conjunto inteiro (metade da lista duplicada), reseta para 0
    if (currentX <= -width) {
      currentX = 0;
    }
    // Se o usuário arrastou para a direita além do início, joga para o final (loop reverso)
    if (currentX > 0) {
      currentX = -width;
    }

    // Aplica a nova posição
    x.set(currentX);
  });

  // Lista duplicada para o efeito infinito
  const infiniteClients = [...clients, ...clients];

  return (
    <section className="py-20 bg-black overflow-hidden relative">
      <div className="container mx-auto px-4 mb-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Clientes atendidos
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Alguns negócios que já receberam nossos serviços e transformaram seus ambientes.
          </p>
        </motion.div>
      </div>

      {/* Container do Carrossel */}
      <div className="relative w-full bg-zinc-950/50 py-10 border-y border-white/5 cursor-grab active:cursor-grabbing">
        
        {/* Sombras laterais (opcional, mas dá acabamento profissional) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            ref={carouselRef}
            className="flex gap-8 px-4"
            style={{ x }} // Conecta o MotionValue ao estilo X
            
            // CONFIGURAÇÃO DO ARRASTAR
            drag="x" 
            dragMomentum={false} // Desativa inércia para o loop retomar imediatamente ao soltar
            onDragStart={() => setIsDragging(true)} // Pausa o loop
            onDragEnd={() => setIsDragging(false)}  // Retoma o loop
            
            // Pausa também ao passar o mouse (opcional, se quiser remover apague as linhas abaixo)
            onHoverStart={() => setIsDragging(true)}
            onHoverEnd={() => setIsDragging(false)}
          >
            {infiniteClients.map((client, index) => (
              <motion.div
                key={`${client.id}-${index}`}
                className="flex-shrink-0 w-48 md:w-56 group pointer-events-auto" // pointer-events-auto garante clique
                // Ao clicar, verifica se foi um clique rápido ou arrasto (o drag do framer lida bem com isso)
                onClick={() => !isDragging && setSelected(client)}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-zinc-900 rounded-xl p-6 aspect-square flex items-center justify-center border border-zinc-800 group-hover:border-blue-500/50 group-hover:bg-zinc-800 transition-all shadow-lg group-hover:shadow-blue-500/10 select-none"> {/* select-none evita arrastar a imagem fantasma */}
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 pointer-events-none" // pointer-events-none na img ajuda no drag
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl font-bold text-zinc-700 group-hover:text-white transition-colors">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center select-none">
                  <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    {client.name}
                  </h3>
                  {client.media && client.media.length > 0 && (
                     <span className="text-xs text-zinc-500 mt-1 block">
                       Ver {client.media.length} fotos
                     </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <ImageModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        items={selected?.media || []}
        initialIndex={0}
        videos={(selected?.media || []).filter((url) =>
          url && url.includes("youtube.com/embed")
        )}
      />
    </section>
  );
}
