import Link from "next/link";

import { services } from "@/content/services";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you requested does not exist or has moved. Explore our services
        or return to the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/services">View services</Link>
        </Button>
      </div>
      <ul className="mt-12 flex flex-wrap justify-center gap-2">
        {services.slice(0, 5).map((s) => (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
            >
              {s.shortTitle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
