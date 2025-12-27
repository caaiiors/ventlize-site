import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ImageModal from "../components/ImageModal";
import { db } from "../services/firebase"; 
import { collection, getDocs } from "firebase/firestore";

export default function ClientsSection() {
  const [selected, setSelected] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsData);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    fetchClients();
  }, []);

  return (
    <section className="py-20 bg-transparent overflow-hidden select-none">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">
          Clientes atendidos
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Alguns negócios que já receberam nossos serviços.
        </p>
      </div>

      {/* Carrossel com Drag */}
      <div className="relative w-full overflow-hidden px-4">
        <motion.div
          className="flex gap-4 justify-center"
          drag="x"
          dragElastic={0.15}
          dragConstraints={{
            left: -(clients.length * 220 - 890),
            right: 0,
          }}
          dragMomentum={{
            power: 0.8,
            restDelta: 10,
          }}
        >
          {clients.map((client) => (
            <motion.div
              key={client.id}
              className="w-[200px] flex-shrink-0 group relative flex flex-col items-center justify-center cursor-pointer"
              onClick={() => setSelected(client)}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {/* Logo container */}
              <div className="h-24 md:h-32 w-full flex items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  draggable="false"
                />
              </div>

              {/* Nome do cliente */}
              <p className="mt-4 text-sm font-medium text-white/0 group-hover:text-white/100 transition-all duration-300 text-center">
                {client.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
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