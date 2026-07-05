/**
 * Serializa datos para inyectar en un <script type="application/ld+json">.
 * Escapa `<` para que un valor con "</script>" no pueda cerrar el tag y
 * ejecutar código (XSS) si algún dato deja de ser estático.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
