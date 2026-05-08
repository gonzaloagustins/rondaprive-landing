import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  isGTMConfigured,
  loadGTM,
  setConsentDefaults,
  updateConsent,
} from "@/lib/analytics";

const STORAGE_KEY = "ronda_consent_v1";

type ConsentDecision = "granted" | "denied";

function readStoredConsent(): ConsentDecision | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
    return null;
  } catch {
    return null;
  }
}

function writeStoredConsent(value: ConsentDecision): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage may be blocked (private mode, quota). Tracking degrades to
    // session-only, which is acceptable.
  }
}

const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isGTMConfigured()) return;
    setConsentDefaults();
    const stored = readStoredConsent();
    if (stored === "granted") {
      updateConsent(true);
      loadGTM();
      return;
    }
    if (stored === "denied") {
      updateConsent(false);
      return;
    }
    setVisible(true);
  }, []);

  const handleAccept = () => {
    updateConsent(true);
    writeStoredConsent("granted");
    loadGTM();
    setVisible(false);
  };

  const handleReject = () => {
    updateConsent(false);
    writeStoredConsent("denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md"
    >
      <div className="rounded-2xl border border-[#1A1814]/10 bg-[#F0EBE3] shadow-xl p-5">
        <p className="text-sm text-[#1A1814] leading-relaxed">
          Usamos cookies para entender cómo se usa el sitio y mejorar la
          experiencia. Puedes aceptar todas o quedarte solo con las necesarias.
        </p>
        <div className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="light-outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleReject}
          >
            Solo necesarias
          </Button>
          <Button
            variant="dark-solid"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleAccept}
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
