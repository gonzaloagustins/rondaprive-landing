import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Search, MapPin, Menu, Plus, ScanLine, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The Compra y Retira flow, told with a phone that keeps pace with the steps.
 *
 * Why this shape rather than a cinematic pinned hero: this is a mid-funnel page
 * the visitor reached from the menu already interested, so the visual has to
 * explain rather than impress. The phone is sticky and swaps screens as each
 * step scrolls past the middle of the viewport — read step 3 and you see step 3.
 * Nothing is scroll-jacked; the visitor keeps control of the page.
 *
 * One screen per step, in order, and the count is asserted below: a mismatch
 * between the steps in the catalog and the screens here is what once made the
 * walkthrough look out of sync.
 *
 * Screens follow the shipped Comprador prototype (menu layout, the live wait
 * time, the order number plus its separate code, the full-bleed green takeover
 * when the order is ready). Venue, bar, product and payment names are generic
 * on purpose: the prototype uses real third-party trademarks, which need
 * permission on a public page. They live in i18n, so swapping them is copy.
 *
 * The step list is the real content: it carries the text, it is what the
 * prerendered HTML and screen readers get, and it reads fine on its own. The
 * phone is decorative reinforcement and is hidden from assistive tech.
 */

interface PickupFlowProps {
  /** `note` is an optional aside — a caveat that must not compete with the step. */
  steps: { title: string; description: string; note?: string }[];
  /** Section heading, supplied by the page so the copy stays in one place. */
  heading: string;
}

/** Fraction of the viewport height where a step becomes the active one. */
const ACTIVATION_LINE = 0.45;

/**
 * The last step whose top has passed the activation line.
 *
 * Measured from live geometry on each scroll frame rather than from
 * IntersectionObserver entries. An observer with a thin band reports threshold
 * crossings, and one callback can carry several at once: scroll faster than a
 * step's spacing and the steps in between enter and leave without ever being
 * reported as intersecting, so picking from the batch skipped them — that is
 * what made the phone jump from step 1 straight to step 4. Entry order is not
 * document order either, so the choice was not even monotonic.
 *
 * Reading positions directly cannot skip: whatever the scroll delta, the answer
 * is always the step the visitor is actually looking at.
 */
const useActiveStep = (count: number) => {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVATION_LINE;
      let next = 0;
      let closest = -Infinity;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > closest) {
          closest = top;
          next = i;
        }
      });

      setActive(next);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
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

/* ---------------------------------------------------------------- primitives */

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
    {children}
  </p>
);

const Screen = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`absolute inset-0 flex flex-col px-4 pt-9 pb-5 ${className ?? ""}`}>
    {children}
  </div>
);

const AppBar = () => (
  <div className="flex items-center justify-between mb-4">
    <span className="font-display text-sm font-bold tracking-tight">Ronda</span>
    <Menu className="w-3.5 h-3.5 text-foreground" />
  </div>
);

/**
 * The device frame. Extracted because the last step shows two of them: the
 * order in preparation and the same order ready, side by side, so the change of
 * state is legible without anything having to animate.
 */
const Phone = ({
  children,
  className,
  state,
}: {
  children: React.ReactNode;
  className?: string;
  /** Which of the two the frame is, on the last step. */
  state: "order" | "preparing";
}) => (
  <div
    aria-hidden
    data-phone={state}
    className={cn(
      "relative w-[248px] h-[508px] rounded-[2.75rem] bg-[#1A1814] p-[10px]",
      "shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]",
      className,
    )}
  >
    <div className="relative w-full h-full rounded-[2.25rem] bg-background overflow-hidden">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-[18px] rounded-full bg-[#1A1814] z-20" />
      {children}
      {/* Home indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-foreground/20 z-20" />
    </div>
  </div>
);

const Field = ({ placeholder }: { placeholder: string }) => (
  <div className="flex items-center gap-2 rounded-xl bg-muted/70 px-3 py-2">
    <Search className="w-3 h-3 text-muted-foreground flex-shrink-0" />
    <span className="text-[10px] text-muted-foreground truncate">{placeholder}</span>
  </div>
);

/* -------------------------------------------------------------------- section */

const PickupFlow = ({ steps, heading }: PickupFlowProps) => {
  const { t } = useTranslation();
  const reduceMotion = usePrefersReducedMotion();
  const { active, itemRefs } = useActiveStep(steps.length);

  const s = (key: string) => t(`product.pickup.screens.${key}`);

  // One list for both the menu and the payment summary. They are the same order
  // seen twice, so reading it from one place is what keeps them agreeing.
  const items = [
    { name: s("item1Name"), desc: s("item1Desc"), price: s("item1Price"), tag: true },
    { name: s("item2Name"), desc: s("item2Desc"), price: s("item2Price"), tag: false },
  ];

  const screens = [
    // 1 — scanning the bar's own QR. No download, which is the point.
    <Screen key="scan" className="!px-0 !pt-0 !pb-0">
      <div className="flex-1 bg-[#1A1814] flex flex-col items-center justify-center gap-4">
        <div className="relative w-32 h-32 rounded-2xl border-2 border-primary/50">
          <ScanLine className="absolute inset-0 m-auto w-14 h-14 text-primary" strokeWidth={1.5} />
          {/* Viewfinder corners */}
          <span className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-2xl" />
          <span className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
          <span className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-2xl" />
          <span className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-2xl" />
        </div>
        <div className="text-center px-6">
          <p className="text-[11px] font-semibold text-white">{s("scanTitle")}</p>
          <p className="text-[9px] text-white/60 mt-1">{s("scanHint")}</p>
        </div>
      </div>
    </Screen>,

    // 2 — the menu: bar header with live wait time, categories, items, cart.
    <Screen key="menu">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-lg bg-foreground flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold truncate">{s("barName")}</p>
          <p className="text-[9px] text-muted-foreground flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            {s("barFloor")}
            <span className="w-1 h-1 rounded-full bg-[#4F7A4A]" />
            <span className="uppercase tracking-[0.08em] font-semibold text-[#4F7A4A]">
              {s("waitLabel")}
            </span>
          </p>
        </div>
      </div>
      <Field placeholder={s("menuSearch")} />
      <div className="flex gap-1.5 mt-2.5">
        <span className="rounded-full bg-foreground text-background text-[9px] font-semibold px-2.5 py-1">
          {s("catAll")}
        </span>
        <span className="rounded-full border border-border text-[9px] px-2.5 py-1 text-muted-foreground">
          {s("catCocktails")}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.name} className="rounded-xl bg-muted/60 p-2 flex gap-2">
            <span className="w-11 h-11 rounded-lg bg-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1">
                <p className="text-[10px] font-semibold leading-tight">{item.name}</p>
                {item.tag && (
                  <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-primary bg-primary/15 rounded-full px-1.5 py-0.5 flex-shrink-0">
                    {s("popular")}
                  </span>
                )}
              </div>
              <p className="text-[8px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">
                {item.desc}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-bold">{item.price}</span>
                <span className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                  <Plus className="w-3 h-3 text-background" strokeWidth={3} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Choosing, not paying yet — that is the next step. */}
      <div className="mt-auto flex items-center justify-between rounded-full border border-border px-3.5 py-2">
        <span className="text-[10px] font-semibold text-foreground">{s("cartLabel")}</span>
        <span className="text-[10px] font-bold text-foreground">2</span>
      </div>
    </Screen>,

    // 3 — paying. Deliberately no processor branding, no payment methods: what
    // you are confirming is the order, and the screen showed only a total.
    <Screen key="pay">
      <AppBar />
      {/* Same rows as the menu — thumbnail, name at 10px semibold, price at
          11px bold, space-y-2 — so the two screens read as one app. The
          description and the add button are dropped: nothing to browse or add
          once you are paying. */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="rounded-xl bg-muted/60 p-2 flex items-center gap-2"
          >
            <span className="w-11 h-11 rounded-lg bg-foreground flex-shrink-0" />
            <p className="text-[10px] font-semibold leading-tight min-w-0 flex-1">
              {item.name}
            </p>
            <span className="text-[11px] font-bold flex-shrink-0">{item.price}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <Label>{s("totalLabel")}</Label>
        <p className="font-display text-4xl font-bold tracking-tight mt-1">
          {s("total")}
        </p>
        <span className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground">
          <Loader className={`w-3 h-3 text-primary ${reduceMotion ? "" : "animate-spin"}`} />
          {s("processingLabel")}
        </span>
      </div>
    </Screen>,

    // 4 — the green takeover, which is what you hold up at the counter. Full
    // bleed is the point: it has to read across a dark bar.
    <Screen key="ready" className="!px-0 !pt-0 !pb-0">
      <div className="flex-1 bg-[#4F7A4A] flex flex-col items-center justify-center text-center px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
          {s("readyBanner")}
        </p>
        <p className="font-display text-6xl font-bold text-white leading-none mt-2">
          {s("orderNumber").replace(/^[A-Za-z]/, "")}
        </p>
        <div className="mt-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/60">
            {s("codeLabel")}
          </p>
          <p className="text-2xl font-bold tracking-[0.28em] text-white mt-0.5">
            {s("codeValue").split("").join(" ")}
          </p>
        </div>
        <p className="text-[10px] text-white/80 mt-4">{s("readyHint")}</p>
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/50 mt-1.5">
          {s("barName")} · {s("barFloor")}
        </p>
        <span className="mt-4 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </span>
      </div>
    </Screen>,
  ];

  /**
   * The same order before it is ready, shown beside the green one on the last
   * step so the change of state reads on its own.
   *
   * Deliberately not a fifth entry in `screens`: it is not a step of its own,
   * and the one-screen-per-step check below is what keeps the phone in sync
   * with the catalog. Same layout as the ready screen on the design system's
   * neutral surface — no green, no amber, and none of what arriving adds: no
   * code, no check.
   */
  const preparing = (
    <Screen key="preparing" className="!px-0 !pt-0 !pb-0">
      <div className="flex-1 bg-muted flex flex-col items-center justify-center text-center px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {s("preparingBanner")}
        </p>
        <p className="font-display text-6xl font-bold text-foreground leading-none mt-2">
          {s("orderNumber").replace(/^[A-Za-z]/, "")}
        </p>
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 mt-4">
          {s("barName")} · {s("barFloor")}
        </p>
      </div>
    </Screen>
  );

  // One screen per step. If the catalog and this array ever drift, clamp rather
  // than render a blank phone — and say so, because it means one of them is
  // wrong.
  if (import.meta.env.DEV && steps.length !== screens.length) {
    console.warn(
      `PickupFlow: ${steps.length} steps but ${screens.length} screens — they must match.`,
    );
  }
  const shown = Math.min(active, screens.length - 1);
  const isLastStep = shown === screens.length - 1;

  return (
    <section className="py-16">
      <div className="section-container">
        <h2 className="text-2xl font-bold mb-10">{heading}</h2>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Phone. First in the DOM on mobile so it is seen before the list,
              and sticky from md up where there is room for it to stay put. */}
          <div className="lg:col-span-5 lg:order-2">
            <div className="md:sticky md:top-28 flex justify-center">
              {/* On the last step the pair sits in one row: the order in
                  preparation, then the same order ready. They overlap by 2rem
                  because two 248px phones do not fit side by side in this
                  column — 464px of pair against 469px of column, so the offset
                  is what makes it fit at all.

                  Gated on xl, not lg: between 1024px and ~1275px the column is
                  narrower than the pair, and the prep phone would sit on top of
                  the step text. Below xl only the ready state shows, which is
                  what the phone did before.

                  No transition on the pair: it is a comparison of two states,
                  not an animation between them.

                  The vertical offset is a transform rather than a margin. A
                  margin makes the row 548px tall, and a sticky element cannot
                  go past the bottom of its column: the taller it is, the sooner
                  the column runs out and pushes it up behind the navbar. A
                  transform offsets it visually and leaves the row at 508px, and
                  it offsets downward only, so nothing reaches above the sticky
                  top. See lg:pb-52 on the list below, which is the other half
                  of keeping this on screen. */}
              <div className="flex items-start">
                {isLastStep && (
                  <Phone state="preparing" className="hidden xl:block translate-y-10">
                    {preparing}
                  </Phone>
                )}

                <Phone state="order" className={isLastStep ? "xl:-ml-8" : undefined}>
                  {screens.map((sc, i) => (
                    <div
                      key={i}
                      data-screen={i}
                      data-active={i === shown ? "true" : "false"}
                      className={`absolute inset-0 ${
                        reduceMotion ? "" : "transition-opacity duration-500 ease-out"
                      } ${i === shown ? "opacity-100" : "opacity-0"}`}
                    >
                      {sc}
                    </div>
                  ))}
                </Phone>
              </div>
            </div>
          </div>

          {/* Steps — the actual content. */}
          {/* Each step reserves a slice of scroll so the phone has room to
              change between them. It used to be 46vh, which read as a near-
              empty screen: a step's content is ~90px, so 78% of the box was
              blank, and the taller the monitor the worse it got. A fixed
              min-h-52 (13rem) is about half that, does not grow with the
              viewport, and still leaves each step ~200px of its own travel.

              lg:pb-52 is what pays for that. The sticky phone needs 620px from
              the top of the viewport (112px of offset plus 508px of phone) and
              cannot extend past the bottom of its column, whose height is this
              list's. At 46vh a step, the list ended 819px down when the last
              step became active — 199px of slack. Halved, it ended at 613px:
              7px short, so the phone was already being pushed up behind the
              navbar on step 04, and further with every pixel scrolled. One more
              step's worth of padding gives back the same 199px of slack. */}
          <ol className="lg:col-span-7 lg:order-1 space-y-10 lg:space-y-0 lg:pb-52">
            {steps.map((step, i) => {
              const isActive = i === shown;
              return (
                <li
                  key={step.title}
                  data-step={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`border-l-2 pl-5 transition-colors duration-300 lg:flex lg:min-h-52 lg:flex-col lg:justify-center ${
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
                  {step.note && (
                    <p className="mt-1.5 text-xs text-muted-foreground/80 max-w-md">
                      {step.note}
                    </p>
                  )}
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
