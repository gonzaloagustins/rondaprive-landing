import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, QrCode, Bell, Minus, Plus } from "lucide-react";

/**
 * The Compra y Retiro flow, told with a phone that keeps pace with the steps.
 *
 * Why this shape rather than a cinematic pinned hero: this is a mid-funnel page
 * the visitor reached from the menu already interested, so the visual has to
 * explain rather than impress. The phone is sticky and swaps screens as each
 * step scrolls past the middle of the viewport — read step 4 and you see step 4.
 * Nothing is scroll-jacked; the visitor keeps control of the page.
 *
 * The step list is the real content: it carries the text, it is what the
 * prerendered HTML and screen readers get, and it reads fine on its own. The
 * phone is decorative reinforcement and is hidden from assistive tech.
 */

const SCREEN_COUNT = 6;
const ORDER_NUMBER = "A-142";

interface PickupFlowProps {
  steps: { title: string; description: string }[];
  /** Section heading, supplied by the page so the copy stays in one place. */
  heading: string;
}

/** Index of the step currently crossing the middle band of the viewport. */
const useActiveStep = (count: number) => {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // The band is thin, so at most one step is inside it. When a scroll
        // jump leaves the band empty we keep the last value rather than
        // resetting, which would flash screen 1 mid-page.
        const inBand = entries.find((e) => e.isIntersecting);
        if (!inBand) return;
        const idx = items.indexOf(inBand.target as HTMLLIElement);
        if (idx !== -1) setActive(idx);
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  return { active, itemRefs };
};

/** Reads the preference synchronously so the first paint is already correct. */
const usePrefersReducedMotion = () => {
  const [reduce] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  });
  return reduce;
};

const ScreenChrome = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute inset-0 flex flex-col px-5 pt-9 pb-6">{children}</div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
    {children}
  </p>
);

const PickupFlow = ({ steps, heading }: PickupFlowProps) => {
  const { t } = useTranslation();
  const reduceMotion = usePrefersReducedMotion();
  const { active, itemRefs } = useActiveStep(steps.length);

  const s = (key: string) => t(`product.pickup.screens.${key}`);

  const screens = [
    // 1 — entry: the QR that opens the menu is still real, it is only the
    // pickup receipt that stopped being a QR.
    <ScreenChrome key="scan">
      <Eyebrow>{s("scanTitle")}</Eyebrow>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-32 h-32 rounded-2xl border-2 border-primary/30 bg-primary/5 flex items-center justify-center">
          <QrCode className="w-16 h-16 text-primary" strokeWidth={1.5} />
        </div>
      </div>
    </ScreenChrome>,

    // 2 — the cart. No prices: currency differs per market and inventing them
    // would put fake numbers on a page that sells accuracy.
    <ScreenChrome key="order">
      <Eyebrow>{s("orderTitle")}</Eyebrow>
      <div className="mt-4 space-y-2.5">
        {[s("item1"), s("item2")].map((item) => (
          <div
            key={item}
            className="rounded-xl bg-white/70 border border-border/60 p-3 flex items-center justify-between"
          >
            <span className="text-xs font-medium text-foreground">{item}</span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Minus className="w-3 h-3" />
              <span className="text-xs font-semibold text-foreground">1</span>
              <Plus className="w-3 h-3 text-primary" />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto h-9 rounded-full bg-primary flex items-center justify-center">
        <span className="text-[11px] font-semibold text-primary-foreground">
          {s("orderTitle")}
        </span>
      </div>
    </ScreenChrome>,

    // 3 — the order number, which replaced the QR receipt.
    <ScreenChrome key="number">
      <Eyebrow>{s("confirmedTitle")}</Eyebrow>
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
          {s("orderNumberLabel")}
        </span>
        <span className="font-display text-5xl font-bold tracking-tight text-foreground">
          {ORDER_NUMBER}
        </span>
      </div>
    </ScreenChrome>,

    // 4 — prepared while the attendee stays in the event.
    <ScreenChrome key="preparing">
      <Eyebrow>{s("preparingTitle")}</Eyebrow>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <span className="font-display text-3xl font-bold text-foreground">
          {ORDER_NUMBER}
        </span>
        <div className="w-32 h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className={`h-full w-2/3 rounded-full bg-primary ${
              reduceMotion ? "" : "animate-pulse"
            }`}
          />
        </div>
        <p className="text-[10px] text-muted-foreground text-center px-4">
          {s("preparingHint")}
        </p>
      </div>
    </ScreenChrome>,

    // 5 — the alert.
    <ScreenChrome key="ready">
      <Eyebrow>{s("preparingTitle")}</Eyebrow>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full rounded-2xl bg-white border border-primary/30 shadow-lg p-4 flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground">{s("readyTitle")}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s("readyHint")}</p>
            <p className="text-[10px] font-semibold text-foreground mt-1.5">
              {s("orderNumberLabel")} {ORDER_NUMBER}
            </p>
          </div>
        </div>
      </div>
    </ScreenChrome>,

    // 6 — handover.
    <ScreenChrome key="done">
      <Eyebrow>{s("doneTitle")}</Eyebrow>
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <span className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
          <Check className="w-7 h-7 text-primary" strokeWidth={2.5} />
        </span>
        <span className="font-display text-2xl font-bold text-foreground">
          {ORDER_NUMBER}
        </span>
        <p className="text-[10px] text-muted-foreground">{s("readyHint")}</p>
      </div>
    </ScreenChrome>,
  ].slice(0, SCREEN_COUNT);

  return (
    <section className="py-16">
      <div className="section-container">
        <h2 className="text-2xl font-bold mb-10">{heading}</h2>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Phone. First in the DOM on mobile so it is seen before the list,
              and sticky from md up where there is room for it to stay put. */}
          <div className="lg:col-span-5 lg:order-2">
            <div className="md:sticky md:top-28 flex justify-center">
              <div
                aria-hidden
                className="relative w-[248px] h-[508px] rounded-[2.75rem] bg-[#1A1814] p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
              >
                <div className="relative w-full h-full rounded-[2.25rem] bg-background overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-[18px] rounded-full bg-[#1A1814] z-20" />

                  {screens.map((screen, i) => (
                    <div
                      key={i}
                      data-screen={i}
                      data-active={i === active ? "true" : "false"}
                      className={`absolute inset-0 ${
                        reduceMotion ? "" : "transition-opacity duration-500 ease-out"
                      } ${i === active ? "opacity-100" : "opacity-0"}`}
                    >
                      {screen}
                    </div>
                  ))}

                  {/* Home indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Steps — the actual content. */}
          <ol className="lg:col-span-7 lg:order-1 space-y-8 lg:space-y-16">
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <li
                  key={step.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`border-l-2 pl-5 transition-colors duration-300 ${
                    isActive ? "border-primary" : "border-border"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-3 transition-colors duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={`font-semibold transition-colors duration-300 ${
                      isActive ? "text-foreground" : "text-foreground/70"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PickupFlow;
