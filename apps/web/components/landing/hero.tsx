"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Code2 } from "lucide-react";

// Animated shader-style background, reserved for the landing hero only so
// application pages stay light (PRD §12). Layered drifting radial gradients
// over a faint grid read as a shader without the WebGL cost.
function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-1/4 -top-1/4 size-[80%] animate-slow-drift rounded-full bg-cobalt-700/30 blur-[128px]" />
      <div className="absolute -right-1/4 top-1/3 size-[70%] animate-slow-drift-2 rounded-full bg-cobalt-500/20 blur-[160px]" />
      <div className="absolute bottom-0 left-1/3 size-[50%] animate-slow-drift rounded-full bg-cobalt-300/10 blur-[128px]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />
    </div>
  );
}

const reveal = (delay: number) => ({
  initial: { opacity: 0, filter: "blur(12px)", y: 16 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  transition: { duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
});

export function Hero() {
  return (
    <section className="relative flex min-h-[88dvh] items-center overflow-hidden">
      <HeroBackground />
      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
        <motion.p
          {...reveal(0)}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted"
        >
          <span className="size-1.5 rounded-full bg-valid" />
          Live on Ethereum Sepolia · Zama Season 3
        </motion.p>

        <motion.h1
          {...reveal(0.12)}
          className="mt-8 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Move value{" "}
          <span className="bg-gradient-to-r from-cobalt-300 to-cobalt-500 bg-clip-text text-transparent">
            privately
          </span>
          .
        </motion.h1>

        <motion.p
          {...reveal(0.24)}
          className="mt-6 max-w-xl text-lg font-light text-muted"
        >
          Every confidential token wrapper on Sepolia in one place. Browse the
          official registry, wrap ERC-20s into encrypted ERC-7984 tokens, and
          decrypt balances only you can see.
        </motion.p>

        <motion.div {...reveal(0.36)} className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/registry"
            className="inline-flex items-center gap-2 rounded-(--radius-btn) bg-cobalt-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cobalt-600"
          >
            Explore the registry
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/developers"
            className="glass inline-flex items-center gap-2 rounded-(--radius-btn) px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-cobalt-500/50"
          >
            <Code2 className="size-4" aria-hidden />
            Build with it
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
