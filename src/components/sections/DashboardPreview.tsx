import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  Activity,
  Armchair,
  ArrowRight,
  BarChart,
  BarChart3,
  Brain,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Home,
  Layers,
  Package,
  PieChart,
  Receipt,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Timer,
  TrendingUp,
  Users,
  Zap,
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

// Decorative icon rail down the left edge of the mock window.
const RAIL_ICONS = [Home, TrendingUp, ShoppingBag, FileText, DollarSign, Users, Settings];

// --- Simulated telemetry -----------------------------------------------------
// Every figure below is invented demo data for a fictional event; the visible
// disclaimer under the frame says so. Keep it that way — attaching made-up
// revenue to a real venue name would read as a customer reference.

const TICK_MS = 400;
const DATA_EVERY = 6; // one simulated order every 2.4 s
const CHART_TOTAL = 44; // samples across the session
const CHART_START = 16; // samples already drawn on first paint

const BASE_GMV = 24_800_000;
const CHART_MAX = 30_000_000;
const BASE_ORDERS = 1847;
const AVG_ORDER = 13_400;
const BASE_WAIT_SEC = 258; // 4 min 18 s
const FIRST_ORDER_ID = 4527;
const FEED_ROWS = 3;
const FEED_EVERY = 2; // a new row every 2 data ticks ≈ 4.8 s

// Cumulative sales curve, normalised 0..1. Slightly super-linear — the night
// ramps up once doors open — with a deterministic wobble so it reads as
// telemetry instead of a formula.
const CURVE = Array.from({ length: CHART_TOTAL }, (_, i) => {
  const p = i / (CHART_TOTAL - 1);
  const wobble = i === 0 ? 0 : Math.sin(i * 1.7) * 0.012 + Math.sin(i * 0.6) * 0.009;
  return Math.min(1, Math.max(0, Math.pow(p, 1.12) + wobble));
});

const SPARKS = {
  gmv: [10, 16, 12, 22, 18, 30, 26, 38, 34, 46, 52, 60],
  orders: [12, 14, 20, 18, 26, 24, 32, 36, 34, 44, 48, 56],
  ticket: [22, 26, 20, 30, 28, 34, 30, 38, 36, 42, 40, 48],
  wait: [52, 48, 54, 44, 46, 38, 40, 32, 36, 28, 26, 22],
};

// Wait minutes and tone per bar, positional with mock.bars.items in the locales.
const BAR_WAIT_MIN = [2, 3, 9, 14];
const BAR_TONE = ["text-emerald-400", "text-emerald-400", "text-amber-400", "text-rose-400"];

// Badge tone per position in mock.orders.pool.
const ORDER_TONE = [
  "bg-amber-400/15 text-amber-300",
  "bg-emerald-400/15 text-emerald-300",
  "bg-primary/15 text-primary",
];

const CHANNELS = [
  { key: "pickup", icon: ShoppingBag, pct: 25, amount: "$6.3M" },
  { key: "seat", icon: Armchair, pct: 30, amount: "$7.4M" },
  { key: "preorder", icon: Tag, pct: 45, amount: "$11.1M" },
];

/**
 * Drives the mock telemetry. The interval only runs while the frame is on
 * screen, so an unscrolled page or a backgrounded tab costs nothing, and it
 * never starts for visitors who asked for reduced motion — they get the final
 * state rendered immediately instead of a frozen half-drawn chart.
 */
function useLiveFrame(ref: RefObject<HTMLElement | null>) {
  // Read synchronously on mount so the first paint already knows whether it is
  // animating; deciding in an effect would render the finished chart and then
  // snap it back to the start.
  const [motionOk] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  });
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!motionOk) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, motionOk]);

  useEffect(() => {
    if (!inView || !motionOk) return;
    const id = window.setInterval(() => setStep((s) => s + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, motionOk]);

  return { step, motionOk, animate: inView && motionOk };
}

const Sparkline = ({ points, className }: { points: number[]; className?: string }) => {
  const max = Math.max(...points);
  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - (v / max) * 90;
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const DashboardPreview = () => {
  const { t, i18n } = useTranslation();
  const { path } = useLocalizedPath();
  const frameRef = useRef<HTMLDivElement>(null);
  const { step, motionOk, animate } = useLiveFrame(frameRef);

  const nf = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);

  const modules = t("dashboardPreview.modules", {
    returnObjects: true,
    defaultValue: [],
  }) as { title: string; subtitle: string }[];
  const bars = t("dashboardPreview.mock.bars.items", {
    returnObjects: true,
    defaultValue: [],
  }) as { name: string; status: string }[];
  const pool = t("dashboardPreview.mock.orders.pool", {
    returnObjects: true,
    defaultValue: [],
  }) as { items: string; status: string }[];

  // Everything below is derived from `step`, never accumulated in state, so a
  // re-render can't drift the figures or make them jump backwards.
  const ordersDelta = motionOk ? Math.floor(step / DATA_EVERY) : 0;
  const orders = BASE_ORDERS + ordersDelta;
  const gmv = BASE_GMV + ordersDelta * AVG_ORDER;
  const avgTicket = gmv / orders;
  const waitSec = BASE_WAIT_SEC + (motionOk ? Math.round(Math.sin(step / 9) * 12) : 0);
  const secondsAgo = motionOk ? Math.round(((step % DATA_EVERY) * TICK_MS) / 1000) : 0;
  const revealed = motionOk ? Math.min(CHART_TOTAL, CHART_START + step) : CHART_TOTAL;

  // The tip creeps upward with GMV so the line and the headline figure agree.
  const scale = gmv / BASE_GMV;
  const chart = useMemo(() => {
    const pts = CURVE.slice(0, revealed).map((v, i) => {
      const x = (i / (CHART_TOTAL - 1)) * 100;
      const y = 100 - ((v * BASE_GMV * scale) / CHART_MAX) * 100;
      return [x, Math.max(0, y)] as const;
    });
    const line = pts
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    const last = pts[pts.length - 1];
    return {
      line,
      area: last ? `${line} L${last[0].toFixed(2)},100 L0,100 Z` : "",
      tip: last,
    };
  }, [revealed, scale]);

  const feedIndex = Math.floor(ordersDelta / FEED_EVERY);
  const feed = pool.length
    ? Array.from({ length: FEED_ROWS }, (_, row) => {
        const n = feedIndex - row;
        const slot = ((n % pool.length) + pool.length) % pool.length;
        return { id: FIRST_ORDER_ID + n, tone: ORDER_TONE[slot % ORDER_TONE.length], ...pool[slot] };
      })
    : [];

  const kpis = [
    {
      key: "gmv",
      icon: DollarSign,
      label: t("dashboardPreview.mock.kpis.gmv"),
      value: `$${(gmv / 1_000_000).toFixed(2)}M`,
      delta: "38%",
      up: true,
      good: true,
      spark: SPARKS.gmv,
    },
    {
      key: "orders",
      icon: Package,
      label: t("dashboardPreview.mock.kpis.orders"),
      value: nf.format(orders),
      delta: "14%",
      up: true,
      good: true,
      spark: SPARKS.orders,
    },
    {
      key: "ticket",
      icon: Receipt,
      label: t("dashboardPreview.mock.kpis.avgTicket"),
      value: `$${(avgTicket / 1000).toFixed(1)}K`,
      delta: "5%",
      up: true,
      good: true,
      spark: SPARKS.ticket,
    },
    {
      key: "wait",
      icon: Timer,
      label: t("dashboardPreview.mock.kpis.avgWait"),
      value: `${Math.floor(waitSec / 60)} ${t("dashboardPreview.mock.units.min")} ${waitSec % 60} ${t("dashboardPreview.mock.units.sec")}`,
      delta: "8%",
      up: false,
      good: true, // a shorter wait is the good direction
      spark: SPARKS.wait,
    },
  ];

  const panel =
    "rounded-xl border border-[hsl(28,10%,18%)] bg-[hsl(28,12%,11%)]";

  return (
    <section className="section-dark py-24" id="dashboard">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
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
          <p className="mt-4 text-muted-foreground text-lg">
            {t("dashboardPreview.description")}
          </p>
        </div>

        {/* Mock window */}
        <div
          ref={frameRef}
          className="overflow-hidden rounded-2xl border border-[hsl(28,10%,18%)] bg-[hsl(28,12%,8%)] shadow-2xl"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-[hsl(28,10%,18%)] px-4 py-3">
            <div className="flex gap-2" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <span className="font-display text-sm italic text-foreground/70">
              {t("dashboardPreview.mock.windowTitle")}
            </span>
          </div>

          <div className="flex">
            {/* Icon rail */}
            <aside
              className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-[hsl(28,10%,18%)] py-4 sm:flex"
              aria-hidden
            >
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 font-display text-sm font-bold text-primary">
                R
              </span>
              {RAIL_ICONS.map((Icon, i) => (
                <span
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    i === 0 ? "bg-primary/10 text-primary" : "text-foreground/35"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </aside>

            <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
              {/* Event header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="relative inline-flex overflow-hidden rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1">
                    <span className="relative z-10 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      <span
                        className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${animate ? "animate-live-pulse" : ""}`}
                      />
                      {t("dashboardPreview.mock.liveBadge")}
                    </span>
                    {animate && (
                      <span
                        aria-hidden
                        className="animate-live-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    )}
                  </span>
                  <h3 className="mt-2 truncate font-display text-xl font-bold sm:text-2xl">
                    {t("dashboardPreview.mock.eventName")}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t("dashboardPreview.mock.eventMeta")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1.5 text-lg font-semibold tabular-nums text-emerald-300">
                    <Clock className="h-4 w-4" aria-hidden />
                    21:42
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {t("dashboardPreview.mock.updatedAgo", { seconds: secondsAgo })}
                  </p>
                </div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {kpis.map((k) => {
                  const Icon = k.icon;
                  const tone = k.good ? "text-emerald-400" : "text-rose-400";
                  return (
                    <div key={k.key} className={`${panel} p-3.5`}>
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                        <span className="truncate">{k.label}</span>
                      </p>
                      <div className="mt-2 flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          {/* tabular-nums keeps the ticking figure from reflowing */}
                          <p className="truncate text-xl font-bold leading-none tabular-nums sm:text-2xl">
                            {k.value}
                          </p>
                          <p className={`mt-1.5 text-[11px] font-medium ${tone}`}>
                            <span aria-hidden>{k.up ? "▲" : "▼"}</span> {k.delta}{" "}
                            <span className="text-muted-foreground">
                              {t("dashboardPreview.mock.vsYesterday")}
                            </span>
                          </p>
                        </div>
                        <Sparkline
                          points={k.spark}
                          className={`h-8 w-14 shrink-0 ${tone}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.55fr_1fr]">
                {/* Chart */}
                <div className={`${panel} p-4`}>
                  <p className="text-sm font-semibold">
                    {t("dashboardPreview.mock.chart.title")}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                    {t("dashboardPreview.mock.chart.legend")}
                  </p>

                  <div className="relative mt-4 h-44 sm:h-52">
                    {/* Gridlines + y labels */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[30, 20, 10, 0].map((m) => (
                        <div key={m} className="flex items-center gap-2">
                          <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
                            ${m}M
                          </span>
                          <span className="h-px flex-1 bg-[hsl(28,10%,18%)]" />
                        </div>
                      ))}
                    </div>
                    {/* Line */}
                    <div className="absolute inset-y-0 left-11 right-0">
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="h-full w-full overflow-visible"
                        aria-hidden
                      >
                        <defs>
                          <linearGradient id="rp-sales-area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {chart.area && <path d={chart.area} fill="url(#rp-sales-area)" />}
                        <path
                          d={chart.line}
                          fill="none"
                          stroke="#34d399"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        {chart.tip && (
                          <circle cx={chart.tip[0]} cy={chart.tip[1]} r={3} fill="#34d399" />
                        )}
                      </svg>
                    </div>
                  </div>

                  <div className="ml-11 mt-2 flex justify-between text-[10px] tabular-nums text-muted-foreground">
                    <span className="text-left">
                      18:00
                      <br />
                      {t("dashboardPreview.mock.chart.open")}
                    </span>
                    <span>20:00</span>
                    <span>21:00</span>
                    <span className="text-right">
                      21:42
                      <br />
                      {t("dashboardPreview.mock.chart.now")}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Bar status */}
                  <div className={`${panel} p-4`}>
                    <p className="flex items-center justify-between text-sm font-semibold">
                      {t("dashboardPreview.mock.bars.title")}
                      <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {bars.map((bar, i) => (
                        <li
                          key={bar.name}
                          className="flex items-center justify-between gap-3 border-b border-[hsl(28,10%,16%)] pb-2.5 last:border-0 last:pb-0"
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full bg-current ${BAR_TONE[i]} ${
                                animate ? "animate-live-pulse" : ""
                              }`}
                              style={{ animationDelay: `${i * 0.35}s` }}
                              aria-hidden
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-xs font-medium">
                                {bar.name}
                              </span>
                              <span className="block truncate text-[10px] text-muted-foreground">
                                {bar.status}
                              </span>
                            </span>
                          </span>
                          <span className={`shrink-0 text-xs font-semibold tabular-nums ${BAR_TONE[i]}`}>
                            {BAR_WAIT_MIN[i]} {t("dashboardPreview.mock.units.min")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Order feed */}
                  <div className={`${panel} p-4`}>
                    <p className="flex items-center justify-between text-sm font-semibold">
                      {t("dashboardPreview.mock.orders.title")}
                      <ShoppingBag className="h-4 w-4 text-primary" aria-hidden />
                    </p>
                    {/* aria-live off: this is decorative demo data, not news */}
                    <ul className="mt-3 space-y-1.5">
                      {feed.map((order) => (
                        <li
                          key={order.id}
                          className={`flex items-center justify-between gap-2 text-xs ${
                            animate ? "animate-order-in" : ""
                          }`}
                        >
                          <span className="min-w-0 truncate">
                            <span className="font-semibold tabular-nums text-primary">
                              #{order.id}
                            </span>{" "}
                            <span className="text-foreground/80">{order.items}</span>
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${order.tone}`}
                          >
                            {order.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 flex items-center justify-between border-t border-[hsl(28,10%,16%)] pt-2.5 text-[11px] text-muted-foreground">
                      {t("dashboardPreview.mock.orders.viewAll")}
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </p>
                  </div>
                </div>
              </div>

              {/* Channels */}
              <div className={`${panel} p-4`}>
                <p className="text-sm font-semibold">
                  {t("dashboardPreview.mock.channels.title")}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-6">
                  {CHANNELS.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <div key={channel.key}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] text-muted-foreground">
                              {t(`dashboardPreview.mock.channels.${channel.key}`)}
                            </p>
                            <p className="flex items-baseline justify-between gap-2">
                              <span className="text-lg font-bold tabular-nums">
                                {channel.pct}%
                              </span>
                              <span className="text-xs tabular-nums text-muted-foreground">
                                {channel.amount}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[hsl(28,10%,18%)]">
                          <div
                            className="h-full rounded-full bg-gradient-gold transition-[width] duration-1000 ease-out"
                            // Reduced motion gets the final width on first paint.
                            style={{ width: !motionOk || animate ? `${channel.pct}%` : "0%" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keeps the visitor honest about what they are looking at */}
        <p className="mt-4 text-center text-[11px] italic text-muted-foreground">
          {t("dashboardPreview.mock.disclaimer")}
        </p>

        {/* Modules */}
        <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {modules.map((mod, i) => {
            const Icon = MODULE_ICONS[i] ?? BarChart3;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-[hsl(28,10%,20%)] bg-[hsl(28,12%,12%)] p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{mod.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{mod.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <p className="text-muted-foreground">
            {t("dashboardPreview.ctaQuestion")}
          </p>
          <Button variant="gold" size="lg" className="group rounded-full" asChild>
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
