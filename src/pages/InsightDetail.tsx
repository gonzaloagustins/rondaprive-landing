import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/shared/SEO";
import { getInsightBySlug } from "@/data/insights";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const SITE_URL = "https://rondaprive.com";

interface ArticleSection {
  heading: string;
  body: string;
}

const InsightDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { lang, path } = useLocalizedPath();
  const post = slug ? getInsightBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <SEO title={t("common.notFound", "Página no encontrada")} noIndex />
          <h1 className="text-2xl font-bold">{t("common.notFound")}</h1>
          <Link to={path("insights")} className="text-primary hover:underline">
            {t("insights.backToInsights")}
          </Link>
        </div>
      </div>
    );
  }

  const postKey = post.titleKey.split(".")[1];
  const title = t(post.titleKey);
  const excerpt = t(post.excerptKey);
  const intro = t(`insights.${postKey}.intro`, { defaultValue: "" });
  const sections = t(`insights.${postKey}.sections`, {
    returnObjects: true,
    defaultValue: [],
  }) as ArticleSection[];
  const articleUrl = `${SITE_URL}${path("insightDetail", `/${post.slug}`)}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: title,
    description: excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: lang,
    mainEntityOfPage: articleUrl,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Insights",
        item: `${SITE_URL}${path("insights")}`,
      },
      { "@type": "ListItem", position: 2, name: title, item: articleUrl },
    ],
  };

  return (
    <>
      <SEO
        pageKey="insightDetail"
        title={title}
        description={excerpt}
        pathSuffix={`/${post.slug}`}
        ogImage={post.image}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="pt-28 pb-24">
        <div className="section-container max-w-3xl">
          <Link
            to={path("insights")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("insights.backToInsights")}
          </Link>

          <header className="space-y-4 mb-10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              {t(`insights.categories.${post.category}`)}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.date}>
                {new Date(`${post.date}T12:00:00`).toLocaleDateString(i18n.language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime} {t("insights.minRead")}
              </span>
            </div>
          </header>

          <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-10">
            <img
              src={post.image}
              alt={title}
              width={800}
              height={450}
              className="w-full h-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          {intro && <p className="text-lg text-muted-foreground leading-relaxed mb-10">{intro}</p>}

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-2xl font-bold">{section.heading}</h2>
                {section.body.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <footer className="mt-14 p-8 card-premium text-center space-y-4">
            <h2 className="text-xl font-bold">{t("insights.detailCtaTitle")}</h2>
            <Button variant="gold" asChild>
              <Link to={path("contact")}>{t("insights.detailCtaButton")}</Link>
            </Button>
          </footer>
        </div>
      </article>
    </>
  );
};

export default InsightDetail;
