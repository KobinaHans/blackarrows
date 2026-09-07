"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <AlertTriangle className="mb-6 h-12 w-12 text-accent" aria-hidden />
      <p className="eyebrow mb-3">Something went wrong</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        An unexpected error occurred
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Our team has been notified. You can try again or return to the home
        page.
        {error?.digest ? (
          <span className="mt-2 block font-mono text-xs">
            Reference: {error.digest}
          </span>
        ) : null}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
