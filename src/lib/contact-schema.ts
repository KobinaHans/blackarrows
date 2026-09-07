import { z } from "zod";

import { industries } from "@/content/company";
import { services } from "@/content/services";

const serviceSlugs: readonly string[] = services.map((s) => s.slug);
const industrySlugs: readonly string[] = industries.map((i) => i.slug);

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  company: z
    .string()
    .trim()
    .min(2, "Please enter your organisation")
    .max(160, "Organisation name is too long"),
  email: z.email("Please enter a valid work email").max(200),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long")
    .regex(/^[+\d\s().-]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  service: z
    .string()
    .refine((v) => v === "" || serviceSlugs.includes(v), "Invalid service")
    .optional()
    .or(z.literal("")),
  industry: z
    .string()
    .refine((v) => v === "" || industrySlugs.includes(v), "Invalid industry")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please give us at least a short description (20+ characters)")
    .max(4000, "Message is too long (4000 characters max)"),
  consent: z.literal(true, {
    error: "Please agree to be contacted about your enquiry",
  }),
  // Honeypot: must remain empty. Bots that auto-fill every field are rejected.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };
