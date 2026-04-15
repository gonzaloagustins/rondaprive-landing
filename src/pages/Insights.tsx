import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import { insights } from "@/data/insights";

const Insights = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const categories = ['all', 'trends', 'cases', 'product', 'industry'] as const;
  const filtered = activeCategory === 'all' ? insights : insights.filter(p => p.category === activeCategory);

  return (
    <>
      <PageHero title={t("insights.heroTitle")} titleHighlight={t("insights.heroHighlight")} subtitle={t("insights.heroSubtitle")} />
      <section className="pb-24">
        <div className="section-container">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'
                }`}>
                {t(`insights.categories.${cat}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <article key={post.id} className="card-premium overflow-hidden group hover:border-primary/30 transition-all duration-300">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={t(post.titleKey)} width={800} height={450} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                </div>
                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t(`insights.categories.${post.category}`)}</span>
                  <h3 className="font-bold text-lg leading-tight">{t(post.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{t(post.excerptKey)}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} {t("insights.minRead")}</span>
                    <span className="text-xs text-primary font-medium">{t("insights.readMore")} →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Insights;
