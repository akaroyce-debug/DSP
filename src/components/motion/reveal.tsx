"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ReactNode } from "react";
import { EASE } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  className?: string;
  /** When true, animates child stagger via `RevealItem`. */
  stagger?: boolean;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Cinematic entrance: elements rise and fade into place with a refined
 * expo-out curve. Triggers once when ~20% in view. Reduced-motion users
 * get the content immediately with no transform.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  stagger = false,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const container: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: EASE,
        delay,
        ...(stagger ? { staggerChildren: 0.08, delayChildren: delay } : {}),
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Child element for staggered reveals; place inside a `<Reveal stagger>`. */
export function RevealItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const item: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE },
    },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
