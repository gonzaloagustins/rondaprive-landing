import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Smartphone, ChefHat, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";

const tabs = [
  { key: 'attendee', icon: Smartphone },
  { key: 'kitchen', icon: ChefHat },
  { key: 'organizer', icon: BarChart3 },
];

const HowItWorksPreview = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('attendee');
  const steps = t(`howItWorks.${activeTab}.steps`, { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="py-24 relative">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(213,168,90,0.04), transparent 60%)',
      }} />

      <div className="section-container">
        <SectionHeader
          label={t("howItWorks.label")}
          title={t("howItWorks.title")}
          titleHighlight={t("howItWorks.titleHighlight")}
          subtitle={t("howItWorks.subtitle")}
        />

        {/* Tabs */}
        <div className="flex justify-center gap-2 mt-12">
          {tabs.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === key
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(`howItWorks.tabs.${key}`)}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((step, i) => (
            <div key={`${activeTab}-${i}`} className="relative card-premium p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="gold-outline" className="group" asChild>
            <Link to="/como-funciona">
              {t("common.learnMore")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPreview;
