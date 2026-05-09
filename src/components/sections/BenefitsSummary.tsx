import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  Users,
  Monitor,
  Network,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

type CardKey = "sales" | "experience" | "control" | "scale";

type CardConfig = {
  key: CardKey;
  icon: LucideIcon;
  Mock: (props: { t: ReturnType<typeof useTranslation>["t"] }) => JSX.Element;
};

const SalesMock = ({ t }: { t: ReturnType<typeof useTranslation>["t"] }) => (
  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#FBF6EC] to-[#F4EAD5] p-4 shadow-inner">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
          {t("benefitsSummary.mocks.salesLabel")}
        </p>
        <p className="mt-1 font-display text-xl font-bold text-foreground">$250,430</p>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        <span aria-hidden>▲</span> 35%
      </span>
    </div>
    <svg
      viewBox="0 0 200 70"
      className="absolute inset-x-4 bottom-4 h-16 w-[calc(100%-2rem)]"
      aria-hidden
    >
      <defs>
        <linearGradient id="salesArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#D5A85A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#D5A85A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,55 C30,50 50,42 70,38 C95,33 110,28 135,20 C160,13 180,9 200,6 L200,70 L0,70 Z"
        fill="url(#salesArea)"
      />
      <path
        d="M0,55 C30,50 50,42 70,38 C95,33 110,28 135,20 C160,13 180,9 200,6"
        fill="none"
        stroke="#D5A85A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="200" cy="6" r="3.5" fill="#D5A85A" />
      <circle cx="200" cy="6" r="6" fill="#D5A85A" fillOpacity="0.25" />
    </svg>
  </div>
);

const PassMock = ({ t }: { t: ReturnType<typeof useTranslation>["t"] }) => (
  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-[#1f1a14]">
    <img
      src="/seamless-experience-800w.webp"
      srcSet="/seamless-experience-480w.webp 480w, /seamless-experience-800w.webp 800w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      alt={t("benefitsSummary.mocks.passTitle") as string}
      width={800}
      height={450}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <p className="absolute inset-x-0 bottom-2 text-center text-[10px] font-medium text-white/90">
      {t("benefitsSummary.mocks.passReady")}
    </p>
  </div>
);

const DashboardMock = ({
  t,
}: {
  t: ReturnType<typeof useTranslation>["t"];
}) => (
  <div className="relative flex h-44 w-full overflow-hidden rounded-2xl bg-[#13110d] p-2 shadow-inner">
    {/* Sidebar */}
    <div className="flex w-7 flex-col items-center gap-2 rounded-lg bg-black/40 py-2">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i === 1 ? "bg-primary" : "bg-white/30"
          }`}
        />
      ))}
    </div>
    {/* Main panel */}
    <div className="relative ml-2 flex flex-1 flex-col">
      <div className="flex items-center justify-between text-[10px] text-white/85">
        <span className="font-semibold">
          {t("benefitsSummary.mocks.dashboardTitle")}
        </span>
        <span className="inline-flex items-center gap-0.5 rounded-md bg-white/10 px-1.5 py-0.5 text-white/70">
          {t("benefitsSummary.mocks.dashboardToday")}
          <ChevronDown className="h-2.5 w-2.5" aria-hidden />
        </span>
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1">
        {[
          { label: "dashboardSales", value: "$25K", delta: "▲18%" },
          { label: "dashboardOrders", value: "1,248", delta: "▲12%" },
          { label: "dashboardProducts", value: "3,682", delta: "▲9%" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md bg-white/5 px-1.5 py-1 leading-tight"
          >
            <p className="text-[7px] uppercase tracking-wide text-white/50">
              {t(`benefitsSummary.mocks.${kpi.label}`)}
            </p>
            <p className="mt-0.5 text-[10px] font-bold text-white">
              {kpi.value}
            </p>
            <p className="text-[7px] font-semibold text-emerald-400">
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 160 50"
        className="mt-2 h-14 w-full"
        aria-hidden
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dashArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#D5A85A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D5A85A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,40 C20,38 35,30 55,28 C75,26 90,22 110,15 C130,8 145,7 160,5 L160,50 L0,50 Z"
          fill="url(#dashArea)"
        />
        <path
          d="M0,40 C20,38 35,30 55,28 C75,26 90,22 110,15 C130,8 145,7 160,5"
          fill="none"
          stroke="#D5A85A"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  </div>
);

const ScaleMock = ({ t }: { t: ReturnType<typeof useTranslation>["t"] }) => (
  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-[#1f1a14]">
    <img
      src="/scale-venue-800w.webp"
      srcSet="/scale-venue-480w.webp 480w, /scale-venue-800w.webp 800w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      alt={t("benefitsSummary.cards.scale.title") as string}
      width={800}
      height={450}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
  </div>
);

const cards: CardConfig[] = [
  { key: "sales", icon: TrendingUp, Mock: SalesMock },
  { key: "experience", icon: Users, Mock: PassMock },
  { key: "control", icon: Monitor, Mock: DashboardMock },
  { key: "scale", icon: Network, Mock: ScaleMock },
];

const delayClasses = [
  "animate-fade-in-delay-1",
  "animate-fade-in-delay-2",
  "animate-fade-in-delay-3",
  "animate-fade-in-delay-4",
];

const BenefitsSummary = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) {
      setVisible(true);
      return;
    }
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24" id="beneficios" ref={sectionRef}>
      <div className="section-container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t("benefitsSummary.label")}
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t("benefitsSummary.titleStart")}{" "}
            <em className="font-display italic text-gradient-gold">
              {t("benefitsSummary.titleHighlight")}
            </em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            {t("benefitsSummary.subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ key, icon: Icon, Mock }, i) => (
            <article
              key={key}
              className={`group relative flex flex-col rounded-3xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl lg:p-7 ${
                visible ? delayClasses[i] : "opacity-0"
              }`}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </span>

              <h3 className="mt-5 font-display text-xl font-bold leading-snug lg:text-2xl">
                {t(`benefitsSummary.cards.${key}.title`)}
              </h3>

              <span
                aria-hidden
                className="mt-3 block h-[2px] w-12 rounded-full bg-gradient-to-r from-primary to-[#A07D3A]"
              />

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`benefitsSummary.cards.${key}.description`)}
              </p>

              <div className="mt-6">
                <Mock t={t} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSummary;
