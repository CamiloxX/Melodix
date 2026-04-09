"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  YouTubeLogo,
  YouTubeMusicLogo,
  SpotifyLogo,
  SoundCloudLogo,
  BandcampLogo,
  TwitchLogo,
} from "@/components/ui/PlatformLogos";
import { cn } from "@/lib/utils";

// Definición inline con logos reales en lugar del icon string
const PLATFORMS = [
  {
    name: "YouTube",
    description: "Links directos y búsquedas",
    bgColor: "rgba(255, 0, 0, 0.1)",
    borderColor: "rgba(255, 0, 0, 0.2)",
    hoverBorder: "rgba(255, 0, 0, 0.4)",
    Logo: YouTubeLogo,
  },
  {
    name: "YouTube Music",
    description: "Búsquedas optimizadas",
    bgColor: "rgba(255, 0, 0, 0.1)",
    borderColor: "rgba(255, 0, 0, 0.2)",
    hoverBorder: "rgba(255, 0, 0, 0.4)",
    Logo: YouTubeMusicLogo,
  },
  {
    name: "Spotify",
    description: "Tracks, álbumes, playlists",
    bgColor: "rgba(29, 185, 84, 0.1)",
    borderColor: "rgba(29, 185, 84, 0.2)",
    hoverBorder: "rgba(29, 185, 84, 0.4)",
    Logo: SpotifyLogo,
  },
  {
    name: "SoundCloud",
    description: "Links y búsquedas",
    bgColor: "rgba(255, 85, 0, 0.1)",
    borderColor: "rgba(255, 85, 0, 0.2)",
    hoverBorder: "rgba(255, 85, 0, 0.4)",
    Logo: SoundCloudLogo,
  },
  {
    name: "Bandcamp",
    description: "Links directos",
    bgColor: "rgba(29, 160, 195, 0.1)",
    borderColor: "rgba(29, 160, 195, 0.2)",
    hoverBorder: "rgba(29, 160, 195, 0.4)",
    Logo: BandcampLogo,
  },
  {
    name: "Twitch",
    description: "Streams en vivo",
    bgColor: "rgba(145, 70, 255, 0.1)",
    borderColor: "rgba(145, 70, 255, 0.2)",
    hoverBorder: "rgba(145, 70, 255, 0.4)",
    Logo: TwitchLogo,
  },
];

function PlatformCard({
  platform,
  index,
}: {
  platform: (typeof PLATFORMS)[0];
  index: number;
}) {
  const { Logo } = platform;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -3, transition: { duration: 0.15 } }}
      className={cn(
        "group flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default text-center",
        "bg-zinc-900/50 transition-all duration-200"
      )}
      style={{
        border: `1px solid ${platform.borderColor}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          platform.hoverBorder;
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          platform.bgColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          platform.borderColor;
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "rgba(24,24,27,0.5)";
      }}
    >
      {/* Logo real de la plataforma */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform"
        style={{ backgroundColor: platform.bgColor }}
      >
        <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
      </div>

      {/* Nombre y descripción */}
      <div>
        <h3 className="text-sm font-bold text-white leading-tight">
          {platform.name}
        </h3>
        <p className="text-xs text-zinc-600 mt-0.5">{platform.description}</p>
      </div>
    </motion.div>
  );
}

export default function Platforms() {
  return (
    <section id="platforms" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-[#0d0b18] to-zinc-950" />
      <div className="absolute inset-0 bg-grid bg-[length:50px_50px] opacity-30" />

      {/* Blobs decorativos */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-pink-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header de sección */}
        <AnimatedSection className="text-center mb-12">
          <SectionBadge className="mb-4">✦ Plataformas</SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Tu música, desde donde{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              sea que esté.
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
            Melodix es compatible con las principales plataformas de música y
            streaming. Pega el enlace o busca por nombre — listo.
          </p>
        </AnimatedSection>

        {/* Grid de plataformas con logos reales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {PLATFORMS.map((platform, index) => (
            <PlatformCard key={platform.name} platform={platform} index={index} />
          ))}
        </div>

        {/* Nota legal sobre Spotify */}
        <AnimatedSection delay={0.3}>
          <div className="max-w-2xl mx-auto flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong className="text-zinc-400">Sobre Spotify:</strong> Melodix
              utiliza la API pública de Spotify para leer metadata (nombres,
              artistas, playlists) y busca el audio equivalente en YouTube Music.
              No se extrae audio de Spotify directamente. Todo funciona dentro de
              los términos legales de cada plataforma.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
