import { Link, NavLink } from "react-router-dom";
import { CONTACT } from "../data/content";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-orange-400" : "text-zinc-200 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-zinc-800 ring-1 ring-white/10" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Ventlize</div>
            <div className="text-xs text-zinc-400">Ar-condicionado</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 sm:flex">
          <NavLink to="/" className={linkClass}>Serviços</NavLink>
          <NavLink to="/portfolio" className={linkClass}>Portfólio</NavLink>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-zinc-200 hover:text-white"
          >
            Instagram
          </a>
        </nav>

        <a
          href={`https://wa.me/${CONTACT.phoneDigits}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition"
        >
          Chamar no WhatsApp
        </a>
      </div>
    </header>
  );
}
