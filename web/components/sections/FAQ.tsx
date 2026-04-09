"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS, type FAQItem } from "@/lib/constants";
import SectionBadge from "@/components/ui/SectionBadge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";
import { INVITE_URL, SUPPORT_URL } from "@/lib/constants";

function FAQAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "rounded-xl border transition-all duration-200",
        isOpen
          ? "bg-zinc-900/80 border-violet-500/30 shadow-[0_0_0_1px_rgba(139,92,246,0.15)]"
          : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={cn("font-semibold text-sm sm:text-base transition-colors", isOpen ? "text-white" : "text-zinc-300")}>
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className={cn("w-4 h-4 transition-colors", isOpen ? "text-violet-400" : "text-zinc-600")}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-0">
              <div className="h-px bg-gradient-to-r from-violet-500/30 via-zinc-700 to-transparent mb-3" />
              <p className="text-sm text-zinc-400 leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function handleToggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-900/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <SectionBadge className="mb-4">
            <HelpCircle className="w-3 h-3" />
            Preguntas frecuentes
          </SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            ¿Tienes{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              dudas?
            </span>
          </h2>
          <p className="text-zinc-400 text-base">
            Las respuestas a las preguntas más comunes sobre Melodix.
          </p>
        </AnimatedSection>

        {/* Acordeón */}
        <div className="space-y-2.5 mb-10">
          {FAQ_ITEMS.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* CTA de soporte */}
        <AnimatedSection delay={0.2} className="text-center">
          <p className="text-sm text-zinc-500">
            ¿No encontraste tu respuesta?{" "}
            <a
              href={SUPPORT_URL}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Únete a nuestro servidor de soporte →
            </a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
