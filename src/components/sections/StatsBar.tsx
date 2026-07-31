import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountingNumber } from "@/components/ui/counting-number";

type Stat = { value: string; label: string };

// Same values the component defaults to, hoisted so its identity is stable:
// an inline object would be a new reference on every render, which restarts
// the count-up through CountingNumber's own effect.
const COUNT_TRANSITION = {
  duration: 3,
  ease: "easeInOut",
  type: "tween",
} as const;

// The figures live in the locales as display strings ("85%", "+40%", "3x"),
// so the number is split out to animate and the affixes are printed as-is.
// Anything without a leading number renders untouched.
const splitValue = (value: string) => {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], target: Number(match[2]), suffix: match[3] };
};

const StatsBar = () => {
  const { t } = useTranslation();
  const stats = t("statsBar.items", { returnObjects: true, defaultValue: [] }) as Stat[];

  const sectionRef = useRef<HTMLElement>(null);
  // Read synchronously on mount: visitors who asked for reduced motion get the
  // final figures rendered straight away instead of a counter.
  const [motionOk] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  });
  // The bar sits below the fold, so counting from mount would finish before
  // anyone scrolled down to it.
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    if (!motionOk) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCounting(true);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);

  return (
    <section className="pt-12 pb-8" ref={sectionRef}>
      <div className="section-container">
        <div className="bg-[#1A1814] rounded-2xl px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          {stats.map((stat, i) => {
            const parts = motionOk ? splitValue(stat.value) : null;
            return (
              <div key={i} className="text-center flex-1">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-gold">
                  {parts ? (
                    <>
                      {parts.prefix}
                      <CountingNumber
                        target={parts.target}
                        autoStart={counting}
                        transition={COUNT_TRANSITION}
                      />
                      {parts.suffix}
                    </>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-semibold mt-2">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
