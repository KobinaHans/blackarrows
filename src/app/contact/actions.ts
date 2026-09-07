"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { industries } from "@/content/company";
import { getService } from "@/content/services";
import { site } from "@/content/site";
import { contactSchema, type ContactState } from "@/lib/contact-schema";
import { serverEnv } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

function clientKey(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown";
  return `contact:${ip}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const env = serverEnv();

  const limit = rateLimit(clientKey(), {
    limit: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW_SECONDS * 1000,
  });
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many requests. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  const raw = {
    name: formData.get("name") ?? "",
    company: formData.get("company") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    service: formData.get("service") ?? "",
    industry: formData.get("industry") ?? "",
    message: formData.get("message") ?? "",
    consent: formData.get("consent") === "on",
    website: formData.get("website") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Honeypot tripped: respond as success so bots learn nothing.
    if (fieldErrors.website) {
      return {
        status: "success",
        message: "Thank you. Your enquiry has been received.",
      };
    }
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const serviceTitle = getService(data.service)?.title ?? "Not specified";
  const industryName =
    industries.find((i) => i.slug === data.industry)?.name ?? "Not specified";

  const subject = `New enquiry from ${data.name} (${data.company})`;
  const text = [
    `Name: ${data.name}`,
    `Organisation: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "-"}`,
    `Service: ${serviceTitle}`,
    `Industry: ${industryName}`,
    "",
    data.message,
  ].join("\n");

  const html = `
    <h2 style="font-family:sans-serif">New enquiry – ${escapeHtml(site.name)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0"><b>Name</b></td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><b>Organisation</b></td><td>${escapeHtml(data.company)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><b>Email</b></td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><b>Phone</b></td><td>${escapeHtml(data.phone || "-")}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><b>Service</b></td><td>${escapeHtml(serviceTitle)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><b>Industry</b></td><td>${escapeHtml(industryName)}</td></tr>
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(data.message)}</p>
  `;

  const to = env.CONTACT_TO_EMAIL ?? site.contact.email;
  const from =
    env.CONTACT_FROM_EMAIL ??
    `TEKKO Website <noreply@${new URL(site.url).hostname}>`;

  if (!env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[contact] RESEND_API_KEY not set – logging enquiry instead:\n" + text,
      );
      return {
        status: "success",
        message:
          "Thank you. Your enquiry has been received (development mode – email delivery disabled).",
      };
    }
    console.error("[contact] RESEND_API_KEY is not configured in production.");
    return {
      status: "error",
      message: `We could not send your message right now. Please email us directly at ${site.contact.email}.`,
    };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject,
      text,
      html,
    });
    if (result?.error) {
      console.error("[contact] Resend error", result.error);
      return {
        status: "error",
        message: `We could not send your message right now. Please email us directly at ${site.contact.email}.`,
      };
    }
    return {
      status: "success",
      message:
        "Thank you. Your enquiry has been received and a member of our engineering team will respond within one business day.",
    };
  } catch (err) {
    console.error("[contact] Unexpected error", err);
    return {
      status: "error",
      message: `We could not send your message right now. Please email us directly at ${site.contact.email}.`,
    };
  }
}
