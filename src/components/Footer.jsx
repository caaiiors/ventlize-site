import { CONTACT } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-400">
          © {new Date().getFullYear()} Ventlize Ar-condicionado
        </div>
        <div className="text-sm text-zinc-400 flex gap-4">
          <a className="hover:text-white" href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="hover:text-white" href={`mailto:${CONTACT.email}`}>
            E-mail
          </a>
        </div>
      </div>
    </footer>
  );
}
