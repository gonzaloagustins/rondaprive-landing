// Fallback literal: el container ID de GTM es público (visible en el HTML de
// cualquier página que lo cargue); evita que un build sin VITE_* apague analytics.
// GTM y el consent_default (denied) se cargan desde el <head> de index.html;
// aquí solo quedan los helpers de consent_update y tracking de eventos.
const GTM_ID = import.meta.env.VITE_GTM_ID ?? "GTM-PCZW9KGK";

function ensureDataLayer(): Record<string, unknown>[] {
  if (!window.dataLayer) window.dataLayer = [];
  return window.dataLayer;
}

export function updateConsent(granted: boolean): void {
  ensureDataLayer().push({
    event: "consent_update",
    consent: {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
    },
  });
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  ensureDataLayer().push({ event: name, ...params });
}

export function isGTMConfigured(): boolean {
  return Boolean(GTM_ID);
}
