import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/shared/PageHero";
import SEO from "@/components/shared/SEO";
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_TERMS,
  type GlossaryCategory,
} from "@/data/glossary";

/**
 * Glossary page — a static, definition-style listing grouped by category.
 *
 * Designed primarily to be cited by AI search engines (ChatGPT, Claude,
 * Perplexity): semantic <article>/<dl>/<dt>/<dd> markup, stable per-term
 * anchors (#id), and a DefinedTermSet JSON-LD that pairs each term with its
 * definition. The schema is also re-emitted by scripts/prerender-meta.mjs
 * so non-JS crawlers see it in the static HTML.
 */
const Glossary = () => {
  const { t } = useTranslation();

  // Group term ids by category for rendering.
  const byCategory = useMemo(() => {
    const map: Record<GlossaryCategory, string[]> = {
      sales: [],
      venue: [],
      tech: [],
      spaces: [],
      metrics: [],
    };
    for (const entry of GLOSSARY_TERMS) map[entry.category].push(entry.id);
    return map;
  }, []);

  // Build the DefinedTermSet JSON-LD from the same source as the rendered DOM
  // so the two stay in sync. The "@id" carries the page URL + anchor so AI
  // agents can deep-link back to the exact term.
  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": "https://rondaprive.com/#glossary",
      name: `${t("glossary.heroTitle")} ${t("glossary.heroHighlight")}`,
      description: t("glossary.heroSubtitle"),
      inDefinedTermSet: "https://rondaprive.com/#glossary",
      hasDefinedTerm: GLOSSARY_TERMS.map((entry) => ({
        "@type": "DefinedTerm",
        "@id": `https://rondaprive.com/#term-${entry.id}`,
        name: t(`glossary.terms.${entry.id}.term`),
        description: t(`glossary.terms.${entry.id}.definition`),
        termCode: entry.id,
        inDefinedTermSet: "https://rondaprive.com/#glossary",
      })),
    };
  }, [t]);

  return (
    <>
      <SEO pageKey="glossary" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title={t("glossary.heroTitle")}
        titleHighlight={t("glossary.heroHighlight")}
        subtitle={t("glossary.heroSubtitle")}
      />
      <section className="pb-24">
        <div className="section-container max-w-4xl">
          {/* Anchor index at the top — handy for both humans and bots to see
              the full term set without scrolling. */}
          <nav
            aria-label={t("glossary.heroTitle")}
            className="card-premium p-6 mb-12"
          >
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
              {GLOSSARY_TERMS.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`glossary.terms.${entry.id}.term`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {GLOSSARY_CATEGORIES.map((category) => {
            const ids = byCategory[category];
            if (!ids.length) return null;
            return (
              <section key={category} className="mb-16">
                <h2 className="text-2xl font-bold mb-6">
                  {t(`glossary.categories.${category}`)}
                </h2>
                <dl className="space-y-6">
                  {ids.map((id) => (
                    <article
                      key={id}
                      id={id}
                      className="card-premium p-6 scroll-mt-24"
                    >
                      <dt className="font-bold text-lg mb-2">
                        {t(`glossary.terms.${id}.term`)}
                      </dt>
                      <dd className="text-muted-foreground leading-relaxed">
                        {t(`glossary.terms.${id}.definition`)}
                      </dd>
                    </article>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Glossary;
