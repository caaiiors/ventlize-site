import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Carregando...
      </div>
    );

  if (!user) {
    return <LoginScreen />;
  }

  return <Dashboard user={user} />;
}

function convertYouTubeToEmbed(url) {
  if (!url) return null;

  // Se já é um embed, retorna como está
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  let videoId;

  // Formato: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  }
  // Formato: https://youtu.be/VIDEO_ID
  else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  // Formato: https://www.youtube.com/embed/VIDEO_ID
  else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return null;
}

// --- TELA DE LOGIN ---
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Painel Administrativo
        </h1>
        {error && (
          <p className="text-red-500 bg-red-500/10 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-white p-3 rounded focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-white p-3 rounded focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded transition"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

// --- DASHBOARD PRINCIPAL ---
function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("clientes");

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-poppins pb-20">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Painel Admin - Ventlize</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 hidden md:block">
              {user.email}
            </span>
            <button
              onClick={() => signOut(auth)}
              className="text-sm bg-red-500/10 text-red-400 px-3 py-1 rounded hover:bg-red-500/20 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Abas */}
      <div className="border-b border-zinc-800 bg-zinc-950/50">
        <div className="container mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab("clientes")}
            className={`px-6 py-4 font-medium transition ${
              activeTab === "clientes"
                ? "text-white border-b-2 border-blue-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            👥 Clientes
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-6 py-4 font-medium transition ${
              activeTab === "portfolio"
                ? "text-white border-b-2 border-blue-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            📸 Portfólio
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {activeTab === "clientes" && <ClientesSection />}
        {activeTab === "portfolio" && <PortfolioSection />}
      </main>
    </div>
  );
}

// --- SEÇÃO: CLIENTES ---
function ClientesSection() {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [media, setMedia] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const handleMediaChange = (index, value) => {
    const newMedia = [...media];
    newMedia[index] = value;
    setMedia(newMedia);
  };

  const addMediaField = () => {
    setMedia([...media, ""]);
  };

  const removeMediaField = (index) => {
    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
  };

  const resetForm = () => {
    setName("");
    setLogo("");
    setMedia([""]);
    setEditingId(null);
  };

  const handleEdit = (client) => {
    setName(client.name);
    setLogo(client.logo);
    setMedia(client.media && client.media.length > 0 ? client.media : [""]);
    setEditingId(client.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteDoc(doc(db, "clients", id));
        await fetchClients();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao deletar cliente");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanMedia = media.filter((url) => url.trim() !== "");

    try {
      const clientData = {
        name,
        logo,
        media: cleanMedia,
      };

      if (editingId) {
        await updateDoc(doc(db, "clients", editingId), clientData);
        alert("Cliente atualizado!");
      } else {
        await addDoc(collection(db, "clients"), clientData);
        alert("Cliente criado!");
      }

      await fetchClients();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* FORMULÁRIO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10 shadow-lg">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {editingId ? "✏️ Editando Cliente" : "➕ Adicionar Novo Cliente"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Nome do Negócio
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 focus:border-blue-500 outline-none text-white"
              placeholder="Ex: Padaria do João"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              URL da Logo
            </label>
            <div className="flex gap-4 items-start">
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 focus:border-blue-500 outline-none text-white"
                placeholder="https://..."
                required
              />
              {logo && (
                <div className="w-12 h-12 bg-white rounded p-1 flex-shrink-0 border border-zinc-600 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Galeria de Fotos (Links)
            </label>
            <div className="space-y-3">
              {media.map((url, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleMediaChange(index, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 focus:border-blue-500 outline-none text-sm text-white"
                      placeholder="https://..."
                    />
                  </div>
                  {url && (
                    <div className="w-12 h-12 bg-zinc-800 rounded overflow-hidden flex-shrink-0 border border-zinc-700">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMediaField(index)}
                    className="p-3 text-red-400 hover:bg-red-500/10 rounded transition flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMediaField}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300"
            >
              + Adicionar mais uma foto
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Salvando..."
                : editingId
                ? "Atualizar Cliente"
                : "Salvar Cliente"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-2 rounded font-medium transition"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTA DE CLIENTES */}
      <h3 className="text-xl font-bold mb-4">
        Lista de Clientes Cadastrados ({clients.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between group hover:border-zinc-700 transition"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-white rounded p-2 flex items-center justify-center flex-shrink-0">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white truncate">{client.name}</h4>
                <p className="text-sm text-zinc-500">
                  {client.media?.length || 0} fotos
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleEdit(client)}
                className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition"
                title="Editar"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(client.id)}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                title="Deletar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {clients.length === 0 && (
          <div className="col-span-full text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
            Nenhum cliente cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}

// --- SEÇÃO: PORTFÓLIO ---
function PortfolioSection() {
  const [portfolio, setPortfolio] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([""]);
  const [videos, setVideos] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleVideoChange = (index, value) => {
    const newVideos = [...videos];
    newVideos[index] = value;
    setVideos(newVideos);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const addVideoField = () => {
    setVideos([...videos, ""]);
  };

  const removeImageField = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const removeVideoField = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImages([""]);
    setVideos([""]);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setImages(item.images && item.images.length > 0 ? item.images : [""]);
    setVideos(item.videos && item.videos.length > 0 ? item.videos : [""]);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este item do portfólio?")) {
      try {
        await deleteDoc(doc(db, "portfolio", id));
        await fetchPortfolio();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao deletar item");
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const cleanImages = images.filter((url) => url.trim() !== "");
  
const cleanVideos = videos
  .filter((url) => url.trim() !== "")
  .map(convertYouTubeToEmbed)
  .filter(Boolean);


  try {
    const portfolioData = {
      title,
      description,
      images: cleanImages,
      videos: cleanVideos,
    };

    if (editingId) {
      await updateDoc(doc(db, "portfolio", editingId), portfolioData);
      alert("Item atualizado!");
    } else {
      await addDoc(collection(db, "portfolio"), portfolioData);
      alert("Item criado!");
    }

    await fetchPortfolio();
    resetForm();
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar. Verifique o console.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div>
      {/* FORMULÁRIO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10 shadow-lg">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {editingId ? "✏️ Editando Item" : "➕ Adicionar Novo Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Título do Serviço
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 focus:border-blue-500 outline-none text-white"
              placeholder="Ex: Instalação Residencial"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 focus:border-blue-500 outline-none text-white"
              placeholder="Descreva o serviço..."
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Fotos (Links)
            </label>
            <div className="space-y-3">
              {images.map((url, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 focus:border-blue-500 outline-none text-sm text-white"
                      placeholder="https://..."
                    />
                  </div>
                  {url && (
                    <div className="w-12 h-12 bg-zinc-800 rounded overflow-hidden flex-shrink-0 border border-zinc-700">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-3 text-red-400 hover:bg-red-500/10 rounded transition flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addImageField}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300"
            >
              + Adicionar mais uma foto
            </button>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Vídeos (Links do YouTube Embed)
            </label>
            <div className="space-y-3">
              {videos.map((url, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleVideoChange(index, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 focus:border-blue-500 outline-none text-sm text-white"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Formato: https://www.youtube.com/embed/VIDEO_ID
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideoField(index)}
                    className="p-3 text-red-400 hover:bg-red-500/10 rounded transition flex-shrink-0 mt-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addVideoField}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300"
            >
              + Adicionar mais um vídeo
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Salvando..."
                : editingId
                ? "Atualizar Item"
                : "Salvar Item"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-2 rounded font-medium transition"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTA DO PORTFÓLIO */}
      <h3 className="text-xl font-bold mb-4">
        Itens do Portfólio ({portfolio.length})
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-zinc-700 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{item.title}</h4>
                <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition"
                  title="Editar"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Miniaturas das Fotos e Vídeos */}
            <div className="flex gap-2 flex-wrap mt-3">
              {item.images?.map((img, idx) => (
                <div
                  key={`img-${idx}`}
                  className="w-16 h-16 rounded border border-zinc-700 overflow-hidden"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {item.videos?.map((_, idx) => (
                <div
                  key={`vid-${idx}`}
                  className="w-16 h-16 rounded border border-zinc-700 bg-zinc-800 flex items-center justify-center text-xs text-zinc-400"
                >
                  ▶️ Vídeo
                </div>
              ))}
            </div>
          </div>
        ))}

        {portfolio.length === 0 && (
          <div className="col-span-full text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
            Nenhum item no portfólio ainda.
          </div>
        )}
      </div>
    </div>
  );
}
export function DashboardStats() {
  const [clientCount, setClientCount] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clientsSnap = await getDocs(collection(db, "clients"));
        const portfolioSnap = await getDocs(collection(db, "portfolio"));
        setClientCount(clientsSnap.size);
        setPortfolioCount(portfolioSnap.size);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
        <p className="text-zinc-400 text-sm">Clientes</p>
        <p className="text-2xl font-bold text-white">{clientCount}</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
        <p className="text-zinc-400 text-sm">Portfólio</p>
        <p className="text-2xl font-bold text-white">{portfolioCount}</p>
      </div>
    </div>
  );
}
