import { useTranslation } from "react-i18next";
import { BarChart3, Package, Activity, ShoppingCart, PieChart } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const moduleIcons = [BarChart3, Package, Activity, ShoppingCart, PieChart];

const DashboardPreview = () => {
  const { t } = useTranslation();
  const modules = t("dashboard.modules", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label={t("dashboard.label")}
          title={t("dashboard.title")}
          titleHighlight={t("dashboard.titleHighlight")}
          subtitle={t("dashboard.subtitle")}
        />

        <div className="mt-16 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Modules list */}
          <div className="space-y-3">
            {modules.map((mod, i) => {
              const Icon = moduleIcons[i] || BarChart3;
              return (
                <div key={i} className="card-premium p-5 flex items-start gap-4 hover:border-primary/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{mod.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{mod.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dashboard mockup */}
          <div className="card-premium p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">dashboard.rondaprive.com</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gradient-gold">{t("dashboard.stats.revenue")}</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{t("dashboard.stats.revenueLabel")}</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gradient-gold">{t("dashboard.stats.transactions")}</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{t("dashboard.stats.transactionsLabel")}</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gradient-gold">{t("dashboard.stats.avgTicket")}</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{t("dashboard.stats.avgTicketLabel")}</p>
              </div>
            </div>

            {/* Chart mockup */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-end gap-1 h-32 justify-between px-2">
                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, rgba(213,168,90,0.3), rgba(213,168,90,0.8))`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="space-y-2">
              {[
                { name: 'Gin & Tonic Premium', status: 'Listo', time: '14:32' },
                { name: 'Burger Smash x2', status: 'En preparación', time: '14:31' },
                { name: 'Cerveza Artesanal x4', status: 'Entregado', time: '14:28' },
              ].map((order, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 glass-card rounded-lg text-xs">
                  <span className="font-medium">{order.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full ${
                      order.status === 'Listo' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'Entregado' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{order.status}</span>
                    <span className="text-muted-foreground">{order.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
