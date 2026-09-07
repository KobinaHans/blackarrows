"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { industries } from "@/content/company";
import { services } from "@/content/services";
import {
  contactSchema,
  type ContactInput,
  type ContactState,
  type ContactValues,
} from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  action: (prev: ContactState, formData: FormData) => Promise<ContactState>;
  defaultService?: string;
  defaultIndustry?: string;
}

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm";

export function ContactForm({
  action,
  defaultService = "",
  defaultIndustry = "",
}: ContactFormProps) {
  const [state, setState] = React.useState<ContactState>({ status: "idle" });
  const [pending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      service: services.some((s) => s.slug === defaultService)
        ? defaultService
        : "",
      industry: industries.some((i) => i.slug === defaultIndustry)
        ? defaultIndustry
        : "",
      message: "",
      consent: undefined,
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      fd.append(k, typeof v === "boolean" ? (v ? "on" : "") : String(v));
    });
    startTransition(async () => {
      try {
        const result = await action({ status: "idle" }, fd);
        setState(result ?? { status: "error", message: "Unknown response." });
        if (result?.status === "error" && result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof ContactInput, { message });
          });
        }
        if (result?.status === "success") reset();
      } catch {
        setState({
          status: "error",
          message:
            "Something went wrong while sending your message. Please try again.",
        });
      }
    });
  });

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-lg border border-accent/40 bg-accent/5 p-10 text-center"
      >
        <CheckCircle2 className="mb-4 h-12 w-12 text-accent" aria-hidden />
        <h3 className="font-display text-2xl font-bold">Enquiry received</h3>
        <p className="mt-2 max-w-md text-muted-foreground">{state.message}</p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setState({ status: "idle" })}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {state.status === "error" ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message} required>
          {(id, describedBy) => (
            <Input
              id={id}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy}
              {...register("name")}
            />
          )}
        </Field>
        <Field label="Organisation" error={errors.company?.message} required>
          {(id, describedBy) => (
            <Input
              id={id}
              autoComplete="organization"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={describedBy}
              {...register("company")}
            />
          )}
        </Field>
        <Field label="Work email" error={errors.email?.message} required>
          {(id, describedBy) => (
            <Input
              id={id}
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy}
              {...register("email")}
            />
          )}
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          {(id, describedBy) => (
            <Input
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy}
              {...register("phone")}
            />
          )}
        </Field>
        <Field label="Service of interest" error={errors.service?.message}>
          {(id, describedBy) => (
            <select
              id={id}
              className={selectClass}
              aria-describedby={describedBy}
              {...register("service")}
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Industry" error={errors.industry?.message}>
          {(id, describedBy) => (
            <select
              id={id}
              className={selectClass}
              aria-describedby={describedBy}
              {...register("industry")}
            >
              <option value="">Select an industry</option>
              {industries.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field
        label="How can we help?"
        error={errors.message?.message}
        required
        hint="Describe the asset, scope, location and timeline where possible."
      >
        {(id, describedBy) => (
          <Textarea
            id={id}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy}
            {...register("message")}
          />
        )}
      </Field>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-input accent-[hsl(var(--accent))]"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          {...register("consent")}
        />
        <div>
          <Label htmlFor="consent" className="leading-snug">
            I agree to be contacted by TEKKO Engineering Group about this
            enquiry. <span className="text-destructive">*</span>
          </Label>
          {errors.consent?.message ? (
            <p id="consent-error" className="mt-1 text-xs text-destructive">
              {errors.consent.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot – hidden from humans, tempting for bots. */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <Button type="submit" size="lg" variant="accent" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send enquiry <Send />
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        Protected by rate limiting and spam filtering. We never share your
        details with third parties.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (id: string, describedBy: string | undefined) => React.ReactNode;
}) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      {children(id, describedBy)}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className={cn("text-xs font-medium text-destructive")}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
