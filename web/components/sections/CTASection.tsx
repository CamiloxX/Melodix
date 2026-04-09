"use client";

import { motion } from "framer-motion";
import { ExternalLink, Music4, ArrowRight } from "lucide-react";
import { INVITE_URL, DOCS_URL } from "@/lib/constants";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function CTASection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* ---- Fondo con degradado premium ---- */}
      <div className="absolute inset-0 bg-[#080610]" />
      <div className="absolute inset-0 bg-grid bg-[length:50px_50px] opacity-30" />

      {/* Blob central grande */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Líneas de brillo superior e inferior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Icono central animado */}
        <AnimatedSection>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex mb-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-glow-violet">
              <Music4 className="w-10 h-10 text-white" />
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Headline */}
        <AnimatedSection delay={0.1}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            <span className="text-white">¿Listo para llevar la</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              música a tu servidor?
            </span>
          </h2>
        </AnimatedSection>

        {/* Descripción */}
        <AnimatedSection delay={0.2}>
          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto">
            Añade Melodix hoy mismo. Es completamente <strong className="text-white font-semibold">gratuito</strong>,
            se configura solo y empieza a funcionar en menos de un minuto.
          </p>
        </AnimatedSection>

        {/* CTAs */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-[length:200%_100%] bg-left text-white shadow-glow-violet hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] hover:bg-right transition-all duration-500"
            >
              <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Invitar Melodix — Gratis
            </motion.a>

            <a
              href={DOCS_URL}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all"
            >
              Ver documentación
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </AnimatedSection>

        {/* Social proof mini */}
        <AnimatedSection delay={0.45} className="mt-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/60 border border-zinc-800">
            {/* Avatares fake */}
            <div className="flex -space-x-2">
              {["from-violet-500 to-purple-600", "from-pink-500 to-rose-600", "from-cyan-500 to-blue-600", "from-green-500 to-emerald-600"].map((g, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${g} border-2 border-zinc-950`}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">
              Únete a <span className="text-zinc-300 font-semibold">500+ servidores</span> que ya usan Melodix
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
