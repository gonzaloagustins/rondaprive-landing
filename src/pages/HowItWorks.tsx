import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Smartphone, ChefHat, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";

const tabs = [
  { key: 'attendee', icon: Smartphone },
  { key: 'kitchen', icon: ChefHat },
  { key: 'organizer', icon: BarChart3 },
];

const HowItWorks = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('attendee');
  const steps = t(`howItWorks.${activeTab}.steps`, { returnObjects: true }) as { title: string; description: string }[];

  return (
    <>
      <PageHero title={t("howItWorks.label")} titleHighlight={t("howItWorks.titleHighlight")} subtitle={t("howItWorks.subtitle")} />

      <section className="pb-24">
        <div className="section-container">
          <div className="flex justify-center gap-3 mb-12">
            {tabs.map(({ key, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeTab === key ? 'bg-primary text-primary-foreground shadow-lg' : 'glass-card text-muted-foreground hover:text-foreground'
                }`}>
                <Icon className="w-4 h-4" />{t(`howItWorks.tabs.${key}`)}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {steps.map((step, i) => (
              <div key={`${activeTab}-${i}`} className="card-premium p-6 flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="gold" size="lg" className="group" asChild>
              <Link to="/contacto">{t("navbar.requestDemo")} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
