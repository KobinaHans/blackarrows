"use client";

import * as React from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  once?: boolean;
  as?: "div" | "section" | "li" | "span";
}

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

const VIEWPORT_MARGIN = "0px 0px -80px 0px";

/**
 * Scroll-reveal state machine that never hides server-rendered content.
 *
 * - "static": rendered visible (SSR + first paint). Elements already inside
 *   the viewport on mount stay here so LCP is not delayed and the page works
 *   without JavaScript.
 * - "hidden": element was below the fold on mount; instantly hidden, waiting.
 * - "visible": scrolled into view; animates in.
 */
function useRevealState(ref: React.RefObject<HTMLElement>, once: boolean) {
  const reduce = useReducedMotion();
  const [state, setState] = React.useState<"static" | "hidden" | "visible">(
    "static",
  );
  const inView = useInView(ref, { once, margin: VIEWPORT_MARGIN });

  React.useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;
    if (rect.top > viewportHeight) setState("hidden");
  }, [ref, reduce]);

  React.useEffect(() => {
    if (state === "hidden" && inView) setState("visible");
  }, [inView, state]);

  return state;
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
  as = "div",
}: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const state = useRevealState(ref, once);
  const offset = offsets[direction] ?? offsets.up;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const Component = m[as];

  return (
    <Component
      ref={ref as React.Ref<never>}
      className={cn(className)}
      variants={variants}
      initial={false}
      animate={state === "hidden" ? "hidden" : "visible"}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: StaggerProps) {
  const ref = React.useRef<HTMLElement>(null);
  const state = useRevealState(ref, true);
  const Component = m[as];
  return (
    <Component
      ref={ref as React.Ref<never>}
      className={className}
      initial={false}
      animate={state === "hidden" ? "hidden" : "visible"}
      variants={{
        hidden: { transition: { duration: 0 } },
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Component = m[as];
  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20, transition: { duration: 0 } },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </Component>
  );
}
