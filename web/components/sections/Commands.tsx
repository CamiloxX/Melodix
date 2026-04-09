"use client";

import { motion } from "framer-motion";
import { Terminal, ChevronRight } from "lucide-react";
import { COMMANDS, type Command } from "@/lib/constants";
import SectionBadge from "@/components/ui/SectionBadge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

// Colores por comando para diferenciación visual
const COMMAND_COLORS: Record<string, string> = {
  play: "text-green-400",
  queue: "text-blue-400",
  nowplaying: "text-violet-400",
  skip: "text-yellow-400",
  pause: "text-orange-400",
  shuffle: "text-pink-400",
  stop: "text-red-400",
};

function CommandCard({ command, index }: { command: Command; index: number }) {
  const color = COMMAND_COLORS[command.name] ?? "text-violet-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ x: 4, transition: { duration: 0.15 } }}
      className={cn(
        "group flex items-start gap-4 p-4 sm:p-5 rounded-xl",
        "bg-zinc-900/50 border border-zinc-800/80",
        "hover:border-zinc-700 hover:bg-zinc-900/80",
        "transition-all duration-200 cursor-default"
      )}
    >
      {/* Prompt símbolo */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <ChevronRight className={cn("w-4 h-4", color)} />
        </div>
      </div>

      {/* Info del comando */}
      <div className="flex-1 min-w-0">
        {/* Usage / sintaxis */}
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <code className="font-mono text-sm font-bold text-white">
            <span className={color}>/{command.name}</span>
            <span className="text-zinc-400 font-normal">
              {command.usage.replace(`/${command.name}`, "")}
            </span>
          </code>
        </div>

        {/* Descripción */}
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          {command.description}
        </p>

        {/* Ejemplo (si existe) */}
        {command.example && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/50">
            <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">
              Ej:
            </span>
            <code className="text-[11px] font-mono text-zinc-400">
              {command.example}
            </code>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Commands() {
  return (
    <section id="commands" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Fondo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-60 h-60 bg-violet-600/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Columna izquierda: texto */}
          <AnimatedSection direction="right">
            <SectionBadge className="mb-4">✦ Comandos</SectionBadge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-5">
              Comandos slash{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                modernos y directos.
              </span>
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              Todos los comandos usan el sistema de slash de Discord.
              Autocompletado incluido, sin prefijos que recordar, sin
              configuración. Escribes, eliges y suena.
            </p>

            {/* Terminal decorativa */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-card">
              {/* Header tipo terminal */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/80">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-zinc-600 font-mono">#canal-música</span>
              </div>
              {/* Líneas de "log" */}
              <div className="p-4 font-mono text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-zinc-600 flex-shrink-0">21:42</span>
                  <span className="text-zinc-400">
                    <span className="text-violet-400">@Tú</span>
                    <span className="text-zinc-500"> usó </span>
                    <span className="text-white font-semibold">/play</span>
                    <span className="text-green-400"> Bohemian Rhapsody</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-600 flex-shrink-0">21:42</span>
                  <span className="text-zinc-400">
                    <span className="text-violet-400">Melodix</span>
                    <span className="text-zinc-500">: </span>
                    <span className="text-green-300">▶ Reproduciendo: Bohemian Rhapsody — Queen</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-600 flex-shrink-0">21:43</span>
                  <span className="text-zinc-400">
                    <span className="text-violet-400">@Amigo</span>
                    <span className="text-zinc-500"> usó </span>
                    <span className="text-white font-semibold">/queue</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-600 flex-shrink-0">21:43</span>
                  <span className="text-zinc-400">
                    <span className="text-violet-400">Melodix</span>
                    <span className="text-zinc-500">: </span>
                    <span className="text-blue-300">📋 4 canciones en la cola</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-zinc-800">
                  <Terminal className="w-3 h-3 text-zinc-600" />
                  <span className="text-zinc-600">Escribe </span>
                  <span className="text-violet-400">/</span>
                  <span className="text-zinc-600"> para ver todos los comandos</span>
                  <span className="inline-block w-1.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse" />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Columna derecha: lista de comandos */}
          <div className="space-y-3">
            {COMMANDS.map((command, index) => (
              <CommandCard key={command.name} command={command} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
