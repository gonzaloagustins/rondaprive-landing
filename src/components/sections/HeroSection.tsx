import { Button } from "@/components/ui/button";
import IPhoneMockup from "@/components/ui/iphone-mockup";
import { ArrowRight, Play, Clock, Zap, ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={`${import.meta.env.BASE_URL}hero-video.mp4`} type="video/mp4" />
        </video>
        {/* Gradient overlays to blend into cream */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, #F5F0EB 35%, rgba(245,240,235,0.85) 60%, transparent 100%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0EB]/30 via-transparent to-[#F5F0EB]/30" />
      </div>

      <div className="section-container relative z-10 w-full pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Headline + CTAs */}
          <div className="hero-text-card space-y-8 animate-fade-in-up">
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl space-y-3">
              <span className="block">
                <span className="inline-block bg-white/60 backdrop-blur-md rounded-2xl px-5 py-2 leading-tight">
                  Experiencia
                </span>
              </span>
              <span className="block">
                <span className="inline-block bg-white/60 backdrop-blur-md rounded-2xl px-5 py-2 leading-tight">
                  <span className="text-gradient-gold italic">sin filas</span>
                </span>
              </span>
              <span className="block">
                <span className="inline-block bg-white/60 backdrop-blur-md rounded-2xl px-5 py-2 leading-tight">
                  en cada evento
                </span>
              </span>
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
            </div>

            {/* Floating badges */}
            <div className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 animate-fade-in-delay-3">
              <div className="w-8 h-8 rounded-full bg-[#F0EBE3] flex items-center justify-center">
                <Clock className="w-4 h-4 text-foreground/70" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">3 min</p>
                <p className="text-[10px] text-muted-foreground">Tiempo pedido</p>
              </div>
            </div>

            <div className="absolute -right-4 top-8 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 animate-fade-in-delay-4">
              <div className="w-8 h-8 rounded-full bg-[#F0EBE3] flex items-center justify-center text-xs font-bold">
                📈
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">+40%</p>
                <p className="text-[10px] text-muted-foreground">Aumento ventas</p>
              </div>
            </div>

            <div className="absolute -right-2 bottom-12 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 animate-fade-in-delay-5">
              <div className="w-8 h-8 rounded-full bg-[#F0EBE3] flex items-center justify-center text-xs">
                ⭐
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">98%</p>
                <p className="text-[10px] text-muted-foreground">Satisfacción</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
