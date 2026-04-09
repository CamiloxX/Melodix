import { Music4, Github, ExternalLink } from "lucide-react";
import { INVITE_URL, DOCS_URL, SUPPORT_URL, NAV_LINKS } from "@/lib/constants";

const LEGAL_LINKS = [
  { label: "Privacidad", href: "#" },
  { label: "Términos de Uso", href: "#" },
  { label: "Contacto", href: SUPPORT_URL },
];

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/60 overflow-hidden">
      {/* Sutil glow superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <Music4 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Melod<span className="text-violet-400">ix</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[200px]">
              El bot de música definitivo para tu comunidad de Discord. Gratis, rápido y sin complicaciones.
            </p>
          </div>

          {/* Col 2: Navegación */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Navegación</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Bot */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">El Bot</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-500 hover:text-violet-400 transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Invitar Bot
                </a>
              </li>
              <li>
                <a
                  href={DOCS_URL}
                  className="text-sm text-zinc-500 hover:text-violet-400 transition-colors"
                >
                  Documentación
                </a>
              </li>
              <li>
                <a
                  href={SUPPORT_URL}
                  className="text-sm text-zinc-500 hover:text-violet-400 transition-colors"
                >
                  Servidor de Soporte
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Legal</h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 text-center sm:text-left">
            © {new Date().getFullYear()} Melodix. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-700 text-center">
            Melodix no está afiliado con Discord Inc., Spotify AB, Google LLC ni ninguna otra plataforma mencionada.
          </p>
        </div>
      </div>
    </footer>
  );
}
