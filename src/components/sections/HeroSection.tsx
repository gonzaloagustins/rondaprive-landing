import { Button } from "@/components/ui/button";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import IPhoneMockup from "@/components/ui/iphone-mockup";
import { ArrowRight, Play, Clock, Zap, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const HERO_PHRASES = [
  "sin filas",
  "sin esperas",
  "premium",
  "única",
  "fluida",
  "instantánea",
  "VIP",
  "sin interrupciones",
  "perfecta",
  "memorable",
  "de lujo",
  "inigualable",
  "personalizada",
  "5 estrellas",
  "sin demoras",
  "excepcional",
];

// Decide whether to load the background video. Respects Save-Data, slow
// connections, and reduced-motion preferences so mobile users on mobile data
// or users with motion sensitivity only see the poster image.
const shouldLoadHeroVideo = (): boolean => {
  if (typeof window === "undefined") return true;
  // Users who asked the OS for reduced motion don't want background video.
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  // Network Information API — not supported on Safari, defaults to load.
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)(2g|slow-2g)$/.test(conn.effectiveType)) {
    return false;
  }
  return true;
};

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  // Computed once on mount so the initial HTML / first render is stable and
  // doesn't re-evaluate on every re-render.
  const [shouldPlayVideo] = useState(shouldLoadHeroVideo);

  useEffect(() => {
    if (!shouldPlayVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    // If video was already buffered (e.g. cached), fire ready state immediately
    if (video.readyState >= 3) {
      setIsVideoReady(true);
    }
    video.play().catch(() => {});
  }, [shouldPlayVideo]);

  const posterUrl = `${import.meta.env.BASE_URL}hero-poster.jpg`;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background video + poster. Poster loads instantly; video fades in on top once ready. */}
      <div className="absolute inset-0 z-0">
        {/* Poster layer: always rendered so LCP paints immediately */}
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {shouldPlayVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={posterUrl}
            onCanPlay={() => setIsVideoReady(true)}
            onLoadedData={() => setIsVideoReady(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* WebM first for Chrome/Firefox/Edge/modern Safari — smaller + more efficient.
                MP4 fallback for older Safari / iOS versions without VP9 support. */}
            <source src={`${import.meta.env.BASE_URL}hero-video.webm`} type="video/webm" />
            <source src={`${import.meta.env.BASE_URL}hero-video.mp4`} type="video/mp4" />
          </video>
        )}
        {/* Gradient overlays to blend into cream */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0EB] via-[#F5F0EB]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0EB]/30 via-transparent to-[#F5F0EB]/30" />
      </div>

      <div className="section-container relative z-10 w-full pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Headline + CTAs */}
          <div className="hero-text-card space-y-8 animate-fade-in-up">
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl space-y-3">
              <span className="block">Experiencia</span>
              <span className="block">
                <ContainerTextFlip
                  words={HERO_PHRASES}
                  interval={2800}
                  className="font-display text-5xl sm:text-6xl md:text-7xl italic px-5 leading-tight"
                />
              </span>
              <span className="block">en cada evento</span>
            </h1>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="dark-solid" size="lg" className="group rounded-full" asChild>
                <Link to="/contacto">
                  Solicitar Demo
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="light-outline" size="lg" className="group rounded-full border-[#1A1814]/40" asChild>
                <Link to="/como-funciona">
                  <Play className="w-4 h-4" />
                  Ver Video
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="relative flex justify-center animate-fade-in-delay-2">
            {/* Sized container matching scaled phone dimensions: 417×876 * 0.56 = 234×491 */}
            {/* Badges are inside this div so positions are relative to the phone */}
            <div className="relative" style={{ width: 234, height: 491 }}>
              <IPhoneMockup
                model="15-pro"
                color="black"
                scale={0.56}
                screenBg="#FBF8F4"
                innerShadow={false}
                style={{ transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}
              >
                {/* App UI — sized for the 393px logical coordinate space */}
                <div className="h-full flex flex-col px-5 py-5 justify-between">
                  {/* Welcome */}
                  <div>
                    <p className="text-[14px] text-muted-foreground">Bienvenido a</p>
                    <p className="font-display text-3xl font-bold text-foreground">Ronda Privé</p>
                  </div>

                  {/* Event card */}
                  <div className="bg-[#F0EBE3] rounded-2xl p-5 text-center">
                    <h3 className="font-display text-2xl font-bold text-foreground">Festival 2026</h3>
                    <p className="text-[14px] text-muted-foreground mt-1">26-30 Marzo</p>
                  </div>

                  {/* Feature icons */}
                  <div className="flex justify-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-xl bg-[#F0EBE3] flex items-center justify-center">
                        <Clock className="w-6 h-6 text-foreground/70" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">Anticipada</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-xl bg-[#F0EBE3] flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-foreground/70" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">En Asiento</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-xl bg-[#F0EBE3] flex items-center justify-center">
                        <Zap className="w-6 h-6 text-foreground/70" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">Express</span>
                    </div>
                  </div>

                  {/* Order button */}
                  <button className="w-full bg-[#1A1814] text-white rounded-xl py-4 text-lg font-semibold flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Pedir Ahora
                  </button>
                </div>
              </IPhoneMockup>

              {/* Floating badges — anchored to the phone container */}
              {/* Left: tiempo de pedido — straddling left edge, top-quarter */}
              <div className="absolute -left-16 top-28 bg-white rounded-2xl shadow-lg px-3 py-2.5 flex items-center gap-2.5 animate-fade-in-delay-3">
                <div className="w-7 h-7 rounded-full bg-[#F0EBE3] flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-foreground/70" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">3 min</p>
                  <p className="text-[9px] text-muted-foreground">Tiempo pedido</p>
                </div>
              </div>

              {/* Right: aumento ventas — straddling right edge, top-quarter */}
              <div className="absolute -right-24 top-16 bg-white rounded-2xl shadow-lg px-3 py-2.5 flex items-center gap-2.5 animate-fade-in-delay-4">
                <div className="w-7 h-7 rounded-full bg-[#F0EBE3] flex items-center justify-center text-xs font-bold">
                  📈
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">+40%</p>
                  <p className="text-[9px] text-muted-foreground">Aumento ventas</p>
                </div>
              </div>

              {/* Right: satisfacción — straddling right edge, above button */}
              <div className="absolute -right-16 bottom-20 bg-white rounded-2xl shadow-lg px-3 py-2.5 flex items-center gap-2.5 animate-fade-in-delay-5">
                <div className="w-7 h-7 rounded-full bg-[#F0EBE3] flex items-center justify-center text-xs">
                  ⭐
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">98%</p>
                  <p className="text-[9px] text-muted-foreground">Satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
