import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const SocialProofSection = () => {
  const { t } = useTranslation();
  const testimonials = t("socialProof.testimonials", { returnObjects: true }) as {
    quote: string; author: string; role: string; company: string;
  }[];

  return (
    <section className="py-24">
      <div className="section-container">
        <SectionHeader
          label={t("socialProof.label")}
          title={t("socialProof.title")}
          titleHighlight={t("socialProof.titleHighlight")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {testimonials.map((item, i) => (
            <div key={i} className="card-premium p-8 space-y-6 hover:border-primary/20 transition-all duration-300">
              <Quote className="w-8 h-8 text-primary/40" />
              <p className="text-lg leading-relaxed italic text-foreground/90">"{item.quote}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">{item.author[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.author}</p>
                  <p className="text-xs text-muted-foreground">{item.role} · {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
