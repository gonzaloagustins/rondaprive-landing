import { LayoutDashboard, PieChart, Activity, Shield, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [LayoutDashboard, PieChart, Activity, Shield, Layers];

const PlatformSection = () => {
  const { t } = useTranslation();
  
  const features = t("platform.features", { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <section id="plataforma" className="py-24 md:py-32 relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">{t("platform.label")}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t("platform.title")}{" "}
              <span className="text-gradient-gold">{t("platform.titleHighlight")}</span>{" "}
              {t("platform.titleEnd")}
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              {t("platform.subtitle")}
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = featureIcons[index];
                return (
                  <div key={index} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            {/* Dashboard mockup */}
            <div className="card-premium p-6 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground">{t("platform.dashboard.live")}</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{t("platform.dashboard.salesToday")}</p>
                  <p className="text-2xl font-bold text-gradient-gold">$47,320</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{t("platform.dashboard.transactions")}</p>
                  <p className="text-2xl font-bold">1,847</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{t("platform.dashboard.avgTicket")}</p>
                  <p className="text-2xl font-bold">$25.60</p>
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="bg-secondary/30 rounded-xl p-4 h-40 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                  <div 
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              {/* Recent orders */}
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold">{t("platform.dashboard.recentOrders")}</p>
                {[
                  { item: "2x Mojito Premium", price: "$28.00", time: "12s" },
                  { item: "Mesa VIP + Botella", price: "$350.00", time: "45s" },
                  { item: "4x Cerveza Import", price: "$32.00", time: "1m" },
                ].map((order, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm">{order.item}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{order.price}</span>
                  </div>
                ))}
              </div>

              {/* Glow effect */}
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-card border border-primary/30 rounded-xl shadow-lg animate-float">
              <p className="text-xs text-muted-foreground">{t("platform.dashboard.lowStock")}</p>
              <p className="text-sm font-semibold">Whisky Premium: 12 {t("platform.dashboard.units")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;