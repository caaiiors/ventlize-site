import { Link, NavLink } from "react-router-dom";
import { CONTACT } from "../data/content";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-orange-400" : "text-zinc-200 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-zinc-800 ring-1 ring-white/10 overflow-hidden">
                <img
                  src="/ventlizelogo.png"
                  alt="Ventlize logo"
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">Ventlize</div>
                <div className="text-xs text-zinc-400">Ar-condicionado</div>
              </div>
            </Link>

            <a
              href={`https://wa.me/${CONTACT.phoneDigits}`}
              target="_blank"
              rel="noreferrer"
              className="sm:hidden rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition"
            >
              WhatsApp
            </a>
          </div>
        <nav className="grid grid-cols-3 gap-1 sm:flex sm:flex-row sm:gap-5 sm:items-center w-full sm:w-auto">
          <NavLink to="/" className={linkClass + " text-center text-sm"}>
            Serviços
          </NavLink>
          <NavLink to="/portfolio" className={linkClass + " text-center text-sm"}>
            Portfólio
          </NavLink>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={linkClass({ isActive: false }) + " text-center"}
            >
              Instagram
            </a>
        </nav>
          <a
            href={`https://wa.me/${CONTACT.phoneDigits}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex rounded-xl bg-orange-500 px-6 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
