import { useTranslation } from "react-i18next";
import { TrendingUp, Smile, Settings, Cpu } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const categories = [
  { key: 'commercial', icon: TrendingUp, color: 'text-green-400 bg-green-500/10' },
  { key: 'experience', icon: Smile, color: 'text-blue-400 bg-blue-500/10' },
  { key: 'operational', icon: Settings, color: 'text-amber-400 bg-amber-500/10' },
  { key: 'technical', icon: Cpu, color: 'text-purple-400 bg-purple-500/10' },
];

const BenefitsSummary = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        background: 'linear-gradient(180deg, transparent, rgba(213,168,90,0.03) 50%, transparent)',
      }} />

      <div className="section-container">
        <SectionHeader
          label={t("benefits.label")}
          title={t("benefits.title")}
          titleHighlight={t("benefits.titleHighlight")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {categories.map(({ key, icon: Icon, color }) => {
            const items = t(`benefits.${key}.items`, { returnObjects: true }) as { title: string; description: string }[];
            return (
              <div key={key} className="card-premium p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">{t(`benefits.${key}.title`)}</h3>
                </div>
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSummary;
