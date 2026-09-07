import { site } from "@/content/site";

export function IndustriesStrip() {
  const items = [...site.clientTypes, ...site.clientTypes];
  return (
    <section
      aria-label="Who we serve"
      className="overflow-hidden border-b bg-background py-6"
    >
      <div className="container mb-3 text-center">
        <p className="eyebrow">Who we serve</p>
      </div>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex w-max animate-marquee gap-12 whitespace-nowrap pr-12 motion-reduce:animate-none">
          {items.map((c, i) => (
            <li
              key={`${c}-${i}`}
              aria-hidden={i >= site.clientTypes.length}
              className="font-display text-lg font-semibold text-muted-foreground"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
