import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="bg-[#F0EBE3]/50 rounded-3xl py-20 px-8 text-center">
          {/* Label */}
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Zap className="w-4 h-4 text-primary" />
            Comienza hoy
          </span>

          {/* Title */}
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            Listo para eliminar{" "}
            <span className="relative inline-block">
              las filas?
              <span className="absolute left-0 bottom-1 w-full h-[6px] bg-primary/20 -z-10 rounded-full" />
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Unete a los eventos que ya están transformando la experiencia de sus
            asistentes
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              variant="dark-solid"
              size="lg"
              className="group rounded-full"
              asChild
            >
              <Link to="/contacto">
                Solicitar Demo
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="light-outline"
              size="lg"
              className="group rounded-full"
              asChild
            >
              <Link to="/contacto">Contactar Ventas</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
