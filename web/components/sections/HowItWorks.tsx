"use client";

import { motion } from "framer-motion";
import { PlusCircle, Headphones, Search, Music2 } from "lucide-react";
import { HOW_IT_WORKS_STEPS, type Step } from "@/lib/constants";
import SectionBadge from "@/components/ui/SectionBadge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  PlusCircle,
  Headphones,
  Search,
  Music2,
};

function StepCard({ step, index }: { step: Step; index: number }) {
  const Icon = ICON_MAP[step.icon] ?? Music2;
  const isLast = index === HOW_IT_WORKS_STEPS.length - 1;

  return (
    <div className="flex flex-col items-center text-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: index * 0.12 }}
        className="relative mb-4"
      >
        {/* Círculo numerado con icono */}
        <div className="relative w-16 h-16 mx-auto">
          {/* Anillo exterior */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/30 to-pink-600/20 blur-sm" />
          <div className="relative w-full h-full rounded-2xl bg-zinc-900 border border-zinc-700 group-hover:border-violet-500/50 flex items-center justify-center">
            <Icon className="w-6 h-6 text-violet-400" />
          </div>
          {/* Número flotante */}
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center shadow-glow-sm">
            {index + 1}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.1 }}
      >
        <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-[200px] mx-auto">
          {step.description}
        </p>
      </motion.div>

      {/* Conector horizontal (solo en desktop, no en el último) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 + 0.3 }}
            className="w-full h-px bg-gradient-to-r from-violet-500/50 to-violet-500/10 origin-left"
            style={{ width: "calc(100% - 80px)", marginLeft: "40px" }}
          />
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Fondo con sutil degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-950" />
      <div className="absolute inset-0 bg-grid bg-[length:50px_50px] opacity-40" />

      {/* Blob */}
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-14">
          <SectionBadge className="mb-4">✦ Cómo funciona</SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Empieza en{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              menos de un minuto.
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto">
            Sin configuración complicada. Sin premium walls. Solo música.
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>

        {/* Demo de comando */}
        <AnimatedSection delay={0.3} className="mt-14 flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-sm">
            <span className="text-zinc-600">#música</span>
            <span className="text-zinc-500">›</span>
            <span className="text-violet-400">/play</span>
            <span className="text-zinc-300">Bohemian Rhapsody Queen</span>
            <span className="inline-block w-0.5 h-4 bg-violet-400 animate-pulse" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
