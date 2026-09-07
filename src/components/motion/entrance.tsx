import { cn } from "@/lib/utils";

interface EntranceProps {
  children: React.ReactNode;
  className?: string;
  /** Delay step (0–5) mapped to 0–500 ms. */
  step?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: "div" | "p" | "span";
}

const delays = [
  "[animation-delay:0ms]",
  "[animation-delay:100ms]",
  "[animation-delay:200ms]",
  "[animation-delay:300ms]",
  "[animation-delay:400ms]",
  "[animation-delay:500ms]",
] as const;

/**
 * Server-renderable, CSS-only entrance animation for above-the-fold content.
 * Unlike scroll-triggered reveals it never hides content before hydration,
 * which keeps LCP fast and works without JavaScript.
 */
export function Entrance({
  children,
  className,
  step = 0,
  as: Component = "div",
}: EntranceProps) {
  return (
    <Component
      className={cn(
        "motion-safe:animate-entrance motion-safe:[animation-fill-mode:both]",
        delays[step] ?? delays[0],
        className,
      )}
    >
      {children}
    </Component>
  );
}
