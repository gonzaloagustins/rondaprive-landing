/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export {};
