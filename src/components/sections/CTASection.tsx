import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="bg-[#F0EBE3]/50 rounded-3xl py-20 px-8 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6">
            Para venues, festivales y estadios en LATAM
          </span>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            Cada fila en tu recinto es{" "}
            <span className="relative inline-block">
              ticket promedio que no vuelve
              <span className="absolute left-0 bottom-1 w-full h-[6px] bg-primary/25 -z-10 rounded-full" />
            </span>
            .
          </h2>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Arena Santiago incrementó sus ventas un 65% al eliminar las filas en
            barra. El tuyo puede ser el siguiente.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              variant="dark-solid"
              size="lg"
              className="group rounded-full"
              asChild
            >
              <Link to="/contacto">
                Agendar demo de 20 min
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Link
              to="/contacto"
              className="text-sm font-medium text-foreground/80 hover:text-foreground underline-offset-4 hover:underline transition-colors"
            >
              Ver caso de éxito →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
