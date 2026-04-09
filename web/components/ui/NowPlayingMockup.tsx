"use client";

import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  ListMusic,
} from "lucide-react";

/**
 * Mockup visual de un embed de Discord "Ahora reproduciendo".
 * Simula la apariencia real de un mensaje de bot en Discord.
 * Es puramente decorativo/ilustrativo.
 */
export default function NowPlayingMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* ---- Blobs de fondo ---- */}
      <div className="absolute -inset-8 rounded-3xl bg-gradient-radial from-violet-600/20 to-transparent blur-2xl" />
      <div className="absolute top-10 right-0 w-40 h-40 bg-pink-600/10 rounded-full blur-3xl" />

      {/* ---- Tarjeta principal "Now Playing" (estilo Discord embed) ---- */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        {/* Header estilo Discord: avatar + nombre del bot */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <span className="text-sm">🎵</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-white">Melodix</span>
            <span className="ml-1.5 text-[10px] font-medium px-1 py-0.5 rounded bg-violet-600 text-white align-middle">
              BOT
            </span>
          </div>
          <span className="text-xs text-zinc-500 ml-auto">Hoy a las 21:42</span>
        </div>

        {/* Embed de Discord */}
        <div className="rounded-lg overflow-hidden shadow-card bg-[#2f3136] border border-[#202225]/80">
          {/* Borde izquierdo de color (característico de embeds de Discord) */}
          <div className="flex">
            <div className="w-1 flex-shrink-0 bg-gradient-to-b from-violet-500 via-purple-500 to-pink-500" />

            <div className="flex-1 p-4">
              {/* Título del embed */}
              <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="text-base">▶️</span> Ahora reproduciendo
              </p>

              {/* Contenido: thumbnail + info */}
              <div className="flex gap-3 mb-4">
                {/* Thumbnail de álbum (placeholder con gradiente) */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎸</span>
                </div>

                {/* Info de la canción */}
                <div className="flex-1 min-w-0">
                  <a className="font-semibold text-white hover:underline cursor-pointer text-sm leading-tight line-clamp-1">
                    Bohemian Rhapsody
                  </a>
                  <p className="text-[#b9bbbe] text-xs mt-0.5">Queen</p>
                  <p className="text-[#72767d] text-[11px] mt-1">
                    💿 A Night at the Opera
                  </p>
                </div>
              </div>

              {/* Barra de progreso animada */}
              <div className="mb-2">
                <div className="h-1.5 bg-[#4f545c] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "63%" }}
                    transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full relative"
                  >
                    {/* Punto de progreso */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md -mr-1.5" />
                  </motion.div>
                </div>
                <div className="flex justify-between text-[10px] text-[#72767d] mt-1">
                  <span>3:42</span>
                  <span>5:55</span>
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center justify-between mt-3">
                <button className="text-[#72767d] hover:text-violet-400 transition-colors">
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
                <button className="text-[#b9bbbe] hover:text-white transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-glow-sm">
                  <Pause className="w-4 h-4 text-white" />
                </button>
                <button className="text-[#b9bbbe] hover:text-white transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
                <button className="text-[#72767d] hover:text-violet-400 transition-colors">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Footer del embed */}
              <div className="mt-3 pt-3 border-t border-[#4f545c]/40 flex items-center justify-between text-[#72767d] text-[10px]">
                <span className="flex items-center gap-1">
                  📺 <span>YouTube Music</span>
                </span>
                <span>🔊 80%</span>
                <span className="flex items-center gap-1">
                  <ListMusic className="w-3 h-3" /> 4 en cola
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- Tarjeta flotante de la cola (más pequeña, detrás) ---- */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-0 mt-3 mx-6"
      >
        <div className="rounded-lg bg-[#2f3136]/80 border border-[#202225]/60 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-full bg-pink-500 rounded-full self-stretch min-h-[14px]" />
            <p className="text-[11px] font-semibold text-pink-400 flex items-center gap-1">
              <ListMusic className="w-3 h-3" /> Cola de reproducción
            </p>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#b9bbbe]">
            {[
              { n: 1, title: "Don't Stop Me Now", artist: "Queen", time: "3:29" },
              { n: 2, title: "We Will Rock You", artist: "Queen", time: "2:02" },
              { n: 3, title: "Another One Bites", artist: "Queen", time: "3:35" },
            ].map((track) => (
              <div key={track.n} className="flex items-center gap-2">
                <span className="text-[#72767d] w-4 text-right">{track.n}.</span>
                <span className="flex-1 truncate">{track.title}</span>
                <span className="text-[#72767d] text-[10px]">{track.time}</span>
              </div>
            ))}
            <p className="text-[#72767d] text-[10px] pt-1">+1 canción más</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
