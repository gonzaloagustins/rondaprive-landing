import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://rondaprive.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_TITLE = "Ronda Privé | Tecnología Premium para Eventos y Venues";
const DEFAULT_DESCRIPTION =
  "Plataforma móvil para eventos y venues. Elimina la espera, maximiza las ventas. Compra anticipada, entrega al asiento y pickup express, sin tótems ni infraestructura adicional.";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const upsertMeta = (selector: string, attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const removeMeta = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const SEO = ({ title, description, ogImage, noIndex }: SEOProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    const finalTitle = title ? `${title} | Ronda Privé` : DEFAULT_TITLE;
    const finalDescription = description ?? DEFAULT_DESCRIPTION;
    const finalImage = ogImage ?? DEFAULT_OG_IMAGE;

    document.title = finalTitle;
    upsertMeta('meta[name="description"]', "name", "description", finalDescription);
    upsertLink("canonical", url);

    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:title"]', "property", "og:title", finalTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", finalDescription);
    upsertMeta('meta[property="og:image"]', "property", "og:image", finalImage);

    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", finalTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", finalDescription);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", finalImage);

    if (noIndex) {
      upsertMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    } else {
      removeMeta('meta[name="robots"]');
    }
  }, [pathname, title, description, ogImage, noIndex]);

  return null;
};

export default SEO;
