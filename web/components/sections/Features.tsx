"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  ListMusic,
  Terminal,
  Sparkles,
  Zap,
  Users,
} from "lucide-react";
import { FEATURES, type Feature } from "@/lib/constants";
import SectionBadge from "@/components/ui/SectionBadge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

// Mapa de iconos para renderizar dinámicamente desde strings
const ICON_MAP: Record<string, React.ElementType> = {
  Globe2,
  ListMusic,
  Terminal,
  Sparkles,
  Zap,
  Users,
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = ICON_MAP[feature.icon] ?? Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative rounded-2xl p-6 border border-zinc-800/80",
        "bg-zinc-900/50 hover:bg-zinc-900/80",
        "hover:border-violet-500/30 hover:shadow-card-hover",
        "transition-all duration-300 cursor-default"
      )}
    >
      {/* Glow hover interno */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br",
          feature.gradient
        )}
      />

      <div className="relative z-10">
        {/* Icono */}
        <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 group-hover:border-violet-500/40 flex items-center justify-center mb-4 transition-colors">
          <Icon className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
        </div>

        {/* Texto */}
        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-violet-100 transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Blob decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header de sección */}
        <AnimatedSection className="text-center mb-14">
          <SectionBadge className="mb-4">✦ Funciones</SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Todo lo que necesitas,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              sin complicaciones.
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Melodix está diseñado para ser potente y fácil al mismo tiempo.
            Desde el primer comando, todo funciona.
          </p>
        </AnimatedSection>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
