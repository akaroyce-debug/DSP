"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { forwardRef, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

const button = cva(
  // Base: physical glass, light sweep, refined tracking.
  "glass-sheen group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight transition-[box-shadow,background,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Solid ink — the primary, confident CTA.
        primary:
          "bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_18px_40px_-18px_rgba(10,10,11,0.6)] hover:shadow-[0_26px_60px_-20px_rgba(10,10,11,0.7)]",
        // Frosted glass — secondary, sits on imagery or paper alike.
        glass:
          "glass text-[var(--color-ink)] hover:text-[var(--color-ink)]",
        // Quiet outline / ghost.
        ghost:
          "border border-[var(--color-line)] bg-transparent text-[var(--color-ink-soft)] hover:bg-[color-mix(in_srgb,var(--color-ink)_4%,transparent)]",
        // Bronze accent — used sparingly for premium moments.
        bronze:
          "bg-[var(--color-bronze)] text-white shadow-[0_18px_40px_-18px_rgba(154,123,79,0.7)] hover:bg-[var(--color-bronze-soft)]",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-[0.95rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type CommonProps = VariantProps<typeof button> & {
  children: ReactNode;
  className?: string;
  /** Disable the magnetic drift (e.g. inside dense layouts). */
  magnetic?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<HTMLMotionProps<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
};

type GlassButtonProps = ButtonAsButton | ButtonAsLink;

const MotionLink = motion.create(Link);

export const GlassButton = forwardRef<HTMLElement, GlassButtonProps>(
  function GlassButton(
    { children, className, variant, size, magnetic = true, ...props },
    ref,
  ) {
    const reduce = useReducedMotion();
    const classes = cn(button({ variant, size }), className);

    const interaction = reduce
      ? {}
      : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } };
    const spring = { type: "spring" as const, stiffness: 400, damping: 22 };

    const inner = (
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    );

    let element: ReactNode;
    if ("href" in props && props.href) {
      element = (
        <MotionLink
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          className={classes}
          transition={spring}
          {...interaction}
        >
          {inner}
        </MotionLink>
      );
    } else {
      const { href: _omit, ...rest } = props as ButtonAsButton;
      void _omit;
      element = (
        <motion.button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={classes}
          transition={spring}
          {...interaction}
          {...rest}
        >
          {inner}
        </motion.button>
      );
    }

    if (magnetic && !reduce) {
      return <Magnetic strength={0.25}>{element}</Magnetic>;
    }
    return <>{element}</>;
  },
);
