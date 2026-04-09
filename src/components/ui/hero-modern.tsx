import React, { useEffect, useRef, useState } from "react";

const STYLE_ID = "hero-orbit-animations";

const OrbitGlyph = () => {
  return (
    <svg viewBox="0 0 120 120" className="h-14 w-14 text-primary/60" aria-hidden>
      <circle
        cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.2"
        className="motion-safe:animate-[spin_12s_linear_infinite]"
        style={{ strokeDasharray: "18 14" }}
      />
      <rect
        x="36" y="36" width="48" height="48" rx="12"
        fill="rgba(213,168,90,0.08)" stroke="currentColor" strokeWidth="1"
      />
      <circle cx="60" cy="60" r="6" fill="currentColor" />
      <path
        d="M60 32v8M60 80v8M32 60h8M80 60h8"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
        className="motion-safe:animate-pulse"
      />
    </svg>
  );
};

interface HeroModernProps {
  badge?: string;
  headline?: React.ReactNode;
  subheadline?: string;
  primaryCTA?: React.ReactNode;
  secondaryCTA?: React.ReactNode;
  metrics?: { label: string; value: string }[];
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const HeroModern: React.FC<HeroModernProps> = ({
  badge,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  metrics = [],
  children,
  rightContent,
}) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      @keyframes hero-intro {
        0% { opacity: 0; transform: translate3d(0, 48px, 0) scale(0.98); filter: blur(8px); }
        60% { filter: blur(0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      @keyframes hero-glow {
        0%, 100% { opacity: 0.4; transform: translate3d(0,0,0); }
        50% { opacity: 0.8; transform: translate3d(0,-6px,0); }
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) { setVisible(true); return; }
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }); },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative isolate min-h-screen w-full overflow-hidden">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-30" style={{ backgroundColor: '#0E0E0E' }} />
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-60" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(213,168,90,0.06) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(213,168,90,0.04) 0.7px, transparent 1px)',
        backgroundSize: '14px 14px',
      }} />
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        background: 'radial-gradient(60% 50% at 50% 10%, rgba(213,168,90,0.12), transparent 70%)',
        filter: 'blur(30px)',
      }} />

      <section
        ref={sectionRef}
        className={`relative flex min-h-screen w-full flex-col justify-center gap-16 px-6 py-28 md:px-10 lg:px-16 xl:px-24 ${
          visible ? 'motion-safe:animate-[hero-intro_0.8s_cubic-bezier(.22,.68,0,1)_forwards]' : 'opacity-0'
        }`}
      >
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center max-w-7xl mx-auto w-full">
          {/* Left: Content */}
          <div className="space-y-8">
            {badge && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {badge}
              </span>
            )}

            {headline && (
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {headline}
              </h1>
            )}

            {subheadline && (
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                {subheadline}
              </p>
            )}

            {(primaryCTA || secondaryCTA) && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {primaryCTA}
                {secondaryCTA}
              </div>
            )}

            {metrics.length > 0 && (
              <div className="flex gap-8 pt-6 border-t border-border/50">
                {metrics.map((m) => (
                  <div key={m.label} className="flex flex-col">
                    <span className="text-2xl font-bold text-gradient-gold md:text-3xl">{m.value}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Custom content or default orbital */}
          <div className="relative">
            {rightContent || (
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Platform</p>
                    <h2 className="text-xl font-semibold">Ronda Privé</h2>
                  </div>
                  <OrbitGlyph />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Plataforma de venta digital para eventos. Pick Up Express, compra desde el asiento y compra anticipada.
                </p>
              </div>
            )}
          </div>
        </div>

        {children}
      </section>
    </div>
  );
};

export default HeroModern;
export { HeroModern, OrbitGlyph };
