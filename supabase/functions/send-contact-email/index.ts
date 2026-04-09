import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TO_EMAIL = "info@rondaprive.com";
const FROM_EMAIL = "info@rondaprive.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const venueTypeLabels: Record<string, string> = {
  nightclub: "Nightclub",
  festival: "Festival",
  stadium: "Estadio",
  bar: "Bar / Venue",
  other: "Otro",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, company, venueType, message } = await req.json();

    if (!name || !email || !company) {
      return new Response(JSON.stringify({ error: "Faltan campos requeridos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const venueLabel = venueTypeLabels[venueType] ?? venueType ?? "No especificado";

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="border-bottom: 2px solid #c9a227; padding-bottom: 8px; color: #c9a227;">
          Nuevo contacto — Ronda Privé
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">Nombre</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px 0; font-weight: bold;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Empresa</td>
            <td style="padding: 8px 0;">${company}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px 0; font-weight: bold;">Tipo de venue</td>
            <td style="padding: 8px 0;">${venueLabel}</td>
          </tr>
          ${
            message
              ? `<tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Mensaje</td>
            <td style="padding: 8px 0;">${message.replace(/\n/g, "<br>")}</td>
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
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Error inesperado." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
