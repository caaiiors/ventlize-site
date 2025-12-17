import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactCTA from "../components/ContactCTA";
import Hero from "../sections/Hero";
import ServicesGrid from "../sections/ServicesGrid";
import PMOCSection from "../sections/PMOCSection";
import PortfolioGrid from "../sections/PortfolioGrid";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>
        <Hero />

        <div id="servicos">
          <ServicesGrid />
        </div>

        <div id="pmoc">
          <PMOCSection />
        </div>

        <div id="portfolio">
          <PortfolioGrid />
        </div>

        <div id="contato">
          <ContactCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
