import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TO_EMAIL = "info@rondaprive.com";
const FROM_EMAIL = "info@rondaprive.com";

const ALLOWED_ORIGINS = new Set([
  "https://rondaprive.com",
  "https://www.rondaprive.com",
  "http://localhost:8080",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin":
      origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://rondaprive.com",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
}

const MAX_LENGTHS: Record<string, number> = {
  name: 120,
  email: 254,
  company: 160,
  venueType: 40,
  message: 2000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Trims and enforces the per-field length cap; returns null on non-string input. */
function sanitizeField(value: unknown, field: keyof typeof MAX_LENGTHS): string | null {
  if (value == null) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > MAX_LENGTHS[field] ? null : trimmed;
}

const venueTypeLabels: Record<string, string> = {
  nightclub: "Nightclub",
  festival: "Festival",
  stadium: "Estadio",
  bar: "Bar / Venue",
  other: "Otro",
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  try {
    const body = await req.json();

    // Honeypot: hidden field real users never fill. Pretend success so bots
    // don't learn they were filtered.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    const name = sanitizeField(body.name, "name");
    const email = sanitizeField(body.email, "email");
    const company = sanitizeField(body.company, "company");
    const venueType = sanitizeField(body.venueType, "venueType");
    const message = sanitizeField(body.message, "message");

    if (name === null || email === null || company === null || venueType === null || message === null) {
      return new Response(JSON.stringify({ error: "Campos inválidos." }), {
        status: 400,
        headers,
      });
    }

    if (!name || !email || !company) {
      return new Response(JSON.stringify({ error: "Faltan campos requeridos." }), {
        status: 400,
        headers,
      });
    }

    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: "Email inválido." }), {
        status: 400,
        headers,
      });
    }

    const venueLabel = venueTypeLabels[venueType] ?? (venueType || "No especificado");

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="border-bottom: 2px solid #c9a227; padding-bottom: 8px; color: #c9a227;">
          Nuevo contacto — Ronda Privé
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">Nombre</td>
            <td style="padding: 8px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px 0; font-weight: bold;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Empresa</td>
            <td style="padding: 8px 0;">${escapeHtml(company)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px 0; font-weight: bold;">Tipo de venue</td>
            <td style="padding: 8px 0;">${escapeHtml(venueLabel)}</td>
          </tr>
          ${
            message
              ? `<tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Mensaje</td>
            <td style="padding: 8px 0;">${escapeHtml(message).replace(/\n/g, "<br>")}</td>
          </tr>`
              : ""
          }
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #888;">
          Enviado desde el formulario de contacto en rondaprive.com
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: email,
        subject: `Nuevo contacto desde rondaprive.com — ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: "Error al enviar el email." }), {
        status: 500,
        headers,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Error inesperado." }), {
      status: 500,
      headers,
    });
  }
});
