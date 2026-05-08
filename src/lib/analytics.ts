const GTM_ID = import.meta.env.VITE_GTM_ID;

let gtmLoaded = false;
let consentDefaultsSet = false;

function ensureDataLayer(): Record<string, unknown>[] {
  if (!window.dataLayer) window.dataLayer = [];
  return window.dataLayer;
}

export function setConsentDefaults(): void {
  if (consentDefaultsSet) return;
  consentDefaultsSet = true;
  const layer = ensureDataLayer();
  // GTM expects raw `arguments` objects from the gtag() helper. Pushing the
  // tuple directly produces the same effect without needing a global gtag.
  layer.push({
    event: "consent_default",
    consent: {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  });
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

export function loadGTM(): void {
  if (gtmLoaded || !GTM_ID || typeof document === "undefined") return;
  gtmLoaded = true;
  ensureDataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(script);
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
