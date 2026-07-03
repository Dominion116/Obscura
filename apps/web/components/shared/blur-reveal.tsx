"use client";

// The signature transition: content reveals with a blur-in, used for
// section entrances across the landing page and the app.

import { motion, type MotionProps } from "motion/react";
import type { ReactNode } from "react";

interface BlurRevealProps extends MotionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function BlurReveal({ children, delay = 0, className, ...rest }: BlurRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
