import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactCTA from "../components/ContactCTA";
import Hero from "../sections/Hero";
import ServicesGrid from "../sections/ServicesGrid";
import PMOCSection from "../sections/PMOCSection";
import AboutSection from "../sections/AboutSection";
import ClientsSection from "../sections/ClientsSection";

export default function ServicesPage() {
  return (

    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>
        <Hero />

      <section className="bg-zinc-950">
        <AboutSection />
        <ServicesGrid />
      </section>

      <section className="bg-zinc-950">
        <PMOCSection />
      </section>

      <section className="bg-zinc-950">
        <ClientsSection />
        <ContactCTA />
      </section>
      
      </main>
      <Footer />
    </div>
  );
}
