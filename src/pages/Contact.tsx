import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, User, Mail, Building, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', company: '', venueType: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: fnError } = await supabase.functions.invoke('send-contact-email', {
      body: formData,
    });

    setLoading(false);

    if (fnError) {
      setError(t("contact.errorMessage"));
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      <PageHero title={t("contact.heroTitle")} titleHighlight={t("contact.heroHighlight")} subtitle={t("contact.heroSubtitle")} />
      <section className="pb-24">
        <div className="section-container max-w-2xl">
          <div className="card-premium p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold">{t("contact.successTitle")}</h3>
                <p className="text-muted-foreground">{t("contact.successMessage")}</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">{t("contact.formTitle")}</h2>
                <p className="text-sm text-muted-foreground mb-6">{t("contact.formSubtitle")}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" required placeholder={t("cta.form.name")} value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" required placeholder={t("cta.form.email")} value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" required placeholder={t("cta.form.company")} value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <select value={formData.venueType} onChange={(e) => setFormData({...formData, venueType: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border/50 text-sm text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors">
                    <option value="">{t("cta.form.venueType")}</option>
                    <option value="nightclub">{t("cta.form.venueTypes.nightclub")}</option>
                    <option value="festival">{t("cta.form.venueTypes.festival")}</option>
                    <option value="stadium">{t("cta.form.venueTypes.stadium")}</option>
                    <option value="bar">{t("cta.form.venueTypes.bar")}</option>
                    <option value="other">{t("cta.form.venueTypes.other")}</option>
                  </select>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                    <textarea rows={3} placeholder={t("cta.form.message")} value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button variant="gold" size="lg" className="w-full group" type="submit" disabled={loading}>
                    {loading ? t("contact.sending") : t("cta.form.submit")}
                    {!loading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
