import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

export function useGTMPageview(): void {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", {
      page_path: location.pathname + location.search + location.hash,
      page_title: document.title,
    });
  }, [location.pathname, location.search, location.hash]);
}
