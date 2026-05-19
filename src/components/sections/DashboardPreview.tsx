import {
  BarChart3,
  Layers,
  BarChart,
  PieChart,
  Activity,
  Brain,
  ShoppingCart,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const MODULE_ICONS = [
  BarChart3,
  Layers,
  BarChart,
  PieChart,
  Activity,
  Brain,
  ShoppingCart,
  Zap,
];

type ModuleCopy = { title: string; subtitle: string };
type OrderCopy = { items: string; status: string };

// Visual-only metadata; the matching status text comes from i18n by index.
const ORDER_VISUALS = [
  { id: "#4521", statusColor: "bg-[#F0EBE3] text-foreground" },
  { id: "#4520", statusColor: "bg-primary/20 text-primary" },
  { id: "#4519", statusColor: "bg-primary/10 text-primary/70" },
];

const barHeights = [40, 55, 45, 65, 50, 75, 60, 80, 55, 70, 65, 85];

const DashboardPreview = () => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();

  const modules = t("dashboardPreview.modules", {
    returnObjects: true,
    defaultValue: [],
  }) as ModuleCopy[];
  const orders = t("dashboardPreview.mock.orders", {
    returnObjects: true,
    defaultValue: [],
  }) as OrderCopy[];

  return (
    <section className="section-dark py-24" id="dashboard">
      <div className="section-container">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t("dashboardPreview.eyebrow")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 leading-tight">
            {t("dashboardPreview.headline")}
            <br />
            <span className="text-gradient-gold">
              {t("dashboardPreview.headlineHighlight")}
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl text-lg">
            {t("dashboardPreview.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left: Feature modules */}
          <div className="grid grid-cols-2 gap-3">
            {modules.map((mod, i) => {
              const Icon = MODULE_ICONS[i] ?? BarChart3;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[hsl(28,10%,20%)] bg-[hsl(28,12%,12%)] p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{mod.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dashboard mockup */}
          <div className="rounded-2xl border border-[hsl(28,10%,20%)] bg-[hsl(28,12%,12%)] p-6 space-y-5">
            {/* Traffic lights + title */}
            <div className="flex items-center justify-between pb-4 border-b border-[hsl(28,10%,20%)]">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground italic">
                {t("dashboardPreview.mock.windowTitle")}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
                <p className="text-xs text-muted-foreground">
                  {t("dashboardPreview.mock.cards.salesToday")}
                </p>
                <p className="text-2xl font-bold mt-1">$45,230</p>
                <p className="text-xs text-green-400 mt-1">+12%</p>
              </div>
              <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
                <p className="text-xs text-muted-foreground">
                  {t("dashboardPreview.mock.cards.orders")}
                </p>
                <p className="text-2xl font-bold mt-1">1,847</p>
                <p className="text-xs text-green-400 mt-1">+8%</p>
              </div>
              <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
                <p className="text-xs text-muted-foreground">
                  {t("dashboardPreview.mock.cards.avgTicket")}
                </p>
                <p className="text-2xl font-bold mt-1">$24.50</p>
                <p className="text-xs text-green-400 mt-1">+5%</p>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
              <p className="text-xs text-muted-foreground mb-3">
                {t("dashboardPreview.mock.chartTitle")}
              </p>
              <div className="flex items-end gap-1.5 h-28 justify-between">
                {barHeights.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          "linear-gradient(to top, rgba(213,168,90,0.3), rgba(213,168,90,0.7))",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div className="space-y-2">
              {orders.map((order, i) => {
                const visual = ORDER_VISUALS[i] ?? ORDER_VISUALS[0];
                return (
                  <div
                    key={visual.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-[hsl(28,10%,20%)] text-xs"
                  >
                    <span>
                      <span className="text-primary font-semibold">{visual.id}</span>{" "}
                      {order.items}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold ${visual.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live update button */}
            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-2 bg-[#F0EBE3] text-[#1A1814] text-xs font-semibold px-5 py-2.5 rounded-full">
                {t("dashboardPreview.mock.liveBadge")}
              </span>
            </div>

            {/* Demo disclaimer — keeps the visitor honest about the data */}
            <p className="text-center text-[10px] text-muted-foreground italic">
              {t("dashboardPreview.mock.disclaimer")}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <p className="text-muted-foreground">
            {t("dashboardPreview.ctaQuestion")}
          </p>
          <Button
            variant="gold"
            size="lg"
            className="group rounded-full"
            asChild
          >
            <Link to={path("contact")}>
              {t("navbar.requestDemo")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
