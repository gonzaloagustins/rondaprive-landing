import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import SEO from "@/components/shared/SEO";
import { faqItems, faqCategories } from "@/data/faq";

const FAQ = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const filtered = activeCategory === 'all' ? faqItems : faqItems.filter(f => f.category === activeCategory);

  // FAQPage JSON-LD for rich results. Uses the full set (not the filtered
  // view) so crawlers see every Q/A regardless of which category tab the
  // user happened to land on.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: t(item.questionKey),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(item.answerKey),
      },
    })),
  };

  return (
    <>
      <SEO pageKey="faq" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero title={t("faq.heroTitle")} titleHighlight={t("faq.heroHighlight")} subtitle={t("faq.heroSubtitle")} />
      <section className="pb-24">
        <div className="section-container max-w-3xl">
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <button onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>
              {t("faq.all")}
            </button>
            {faqCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>
                {t(`faq.categories.${cat}`)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="card-premium overflow-hidden">
                <button onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left">
                  <span className="font-medium pr-4">{t(item.questionKey)}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''}`} />
                </button>
                {openId === item.id && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                    {t(item.answerKey)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
