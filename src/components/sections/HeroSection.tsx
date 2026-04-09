import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Clock, Zap, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 -z-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={`${import.meta.env.BASE_URL}hero-video.mp4`} type="video/mp4" />
        </video>
        {/* Gradient overlays to blend into cream */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0EB] via-[#F5F0EB]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0EB]/30 via-transparent to-[#F5F0EB]/30" />
      </div>

      <div className="section-container w-full pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Headline + CTAs */}
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
              Experiencia{" "}
              <span className="text-gradient-gold italic">sin filas</span>
              <br />
              en cada evento
            </h1>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="dark-solid" size="lg" className="group rounded-full" asChild>
                <Link to="/contacto">
                  Solicitar Demo
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="light-outline" size="lg" className="group rounded-full" asChild>
                <Link to="/como-funciona">
                  <Play className="w-4 h-4" />
                  Ver Video
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="relative flex justify-center animate-fade-in-delay-2">
            {/* Phone frame */}
            <div className="relative w-[280px] sm:w-[300px]">
              <div className="rounded-[2.5rem] border-[8px] border-[#1A1814] bg-[#FBF8F4] shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1A1814] rounded-b-2xl z-10" />

                {/* Screen content */}
                <div className="pt-8 pb-4 px-4 space-y-4">
                  {/* Welcome */}
                  <div>
                    <p className="text-[10px] text-muted-foreground">Bienvenido a</p>
                    <p className="font-display text-lg font-bold text-foreground">Ronda Privé</p>
                  </div>

                  {/* Event card */}
                  <div className="bg-[#F0EBE3] rounded-2xl p-4 text-center">
                    <h3 className="font-display text-xl font-bold text-foreground">Festival 2026</h3>
                    <p className="text-xs text-muted-foreground mt-1">26-30 Marzo</p>
                  </div>

                  {/* Feature icons */}
                  <div className="flex justify-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl bg-[#F0EBE3] flex items-center justify-center">
                        <Clock className="w-4 h-4 text-foreground/70" />
                      </div>
                      <span className="text-[8px] text-muted-foreground">Anticipada</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl bg-[#F0EBE3] flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-foreground/70" />
                      </div>
                      <span className="text-[8px] text-muted-foreground">En Asiento</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl bg-[#F0EBE3] flex items-center justify-center">
                        <Zap className="w-4 h-4 text-foreground/70" />
                      </div>
                      <span className="text-[8px] text-muted-foreground">Express</span>
                    </div>
                  </div>

                  {/* Order button */}
                  <button className="w-full bg-[#1A1814] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Pedir Ahora
                  </button>
                </div>
              </div>
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
