"use client";

import { motion } from "framer-motion";
import { ExternalLink, ChevronDown, Sparkles } from "lucide-react";
import { INVITE_URL, STATS } from "@/lib/constants";
import NowPlayingMockup from "@/components/ui/NowPlayingMockup";

export default function Hero() {
  function scrollToFeatures() {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* ---- Fondo decorativo ---- */}
      <div className="absolute inset-0 bg-grid bg-[length:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />

      {/* Blob violeta izquierda */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
      {/* Blob rosa derecha */}
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none" />
      {/* Blob centro-arriba sutil */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-violet-900/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ---- Columna izquierda: texto ---- */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start mb-6"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                Bot de Música para Discord · Gratis
              </span>
            </motion.div>

            {/* Headline principal */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5"
            >
              La música perfecta,{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                en tu servidor.
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Melodix lleva la mejor música a tu comunidad de Discord. Compatible
              con YouTube, Spotify, SoundCloud y más. Comandos slash modernos,
              colas avanzadas y experiencia fluida desde el primer momento.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
            >
              <a
                href={INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-glow-violet hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 hover:from-violet-500 hover:to-purple-500 transition-all"
              >
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Invitar a mi Servidor
              </a>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-zinc-300 border border-zinc-700 hover:border-violet-500/50 hover:text-white hover:bg-zinc-800/50 transition-all"
              >
                Ver funciones
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 divide-x divide-zinc-800"
            >
              {STATS.map((stat, i) => (
                <div key={stat.label} className={i > 0 ? "pl-6" : ""}>
                  <p className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ---- Columna derecha: Mockup ---- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <NowPlayingMockup />
          </motion.div>
        </div>
      </div>

      {/* Flecha de scroll down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-zinc-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
