"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AnimatedHero() {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-900/80 px-6 py-10 shadow-2xl shadow-slate-950/40 sm:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.16),transparent_28%)]" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/20">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span>Micro Donate & Payment is now available.</span>
        </div>
        <div className="max-w-3xl space-y-6">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Support small donations with confidence</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build your next donation experience with Microtronic payment flows.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Modern landing page layout for creators, NGOs, and community projects that want to collect micro donations securely with a polished, fast UX.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="https://microtronic-thailand.github.io/micro-payment/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore Donate & Payment
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://microtronic-thailand.github.io/privacy-policy/?lang=en"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-white"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
