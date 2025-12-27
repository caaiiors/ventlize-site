import { CONTACT } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
  <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="text-sm text-zinc-400">
          © {new Date().getFullYear()} Ventlize Soluções Térmicas & Inteligentes. Todos os direitos reservados.
          <p>CNPJ: 59.414.602/0001-38 | São Paulo – SP</p>
          <p>Compromisso com qualidade, segurança e eficiência em climatização.</p>
        </div>
        <div className="text-sm text-zinc-400 flex gap-4">
          <a className="hover:text-white" href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="hover:text-white" href={`https://wa.me/${CONTACT.phoneDigits}`}>
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
