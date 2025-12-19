import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactCTA from "../components/ContactCTA";
import PortfolioGrid from "../sections/PortfolioGrid";
import Reveal from "../components/Reveal";

export default function PortfolioPage() {
  return (
    <Reveal>
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden">
      <Navbar />
      <main>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-white">Portfólio</h1>
          <p className="mt-2 text-zinc-300">
            Serviços executados e tipos de manutenção (fotos completas em breve).
          </p>
        </div>
        <PortfolioGrid />
        <ContactCTA />
      </main>
      <Footer />
    </div>
    </Reveal>
  );
}
