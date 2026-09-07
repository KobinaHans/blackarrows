"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";

/**
 * Fades route content in on client-side navigation only. The very first
 * render is left untouched so server-rendered HTML is visible immediately
 * (no opacity:0 flash before hydration, which would delay LCP).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isInitialRender = useRef(true);

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  return (
    <m.div
      key={pathname}
      initial={isInitialRender.current ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
