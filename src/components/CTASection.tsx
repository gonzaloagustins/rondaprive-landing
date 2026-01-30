import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Building, User } from "lucide-react";
import { useState } from "react";

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contacto" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="card-premium p-8 md:p-12 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12">
              {/* Left - Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Lleva tu evento al{" "}
                  <span className="text-gradient-gold">siguiente nivel</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Agenda una demo personalizada y descubre cómo Ronda Privé puede transformar la experiencia en tus eventos.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Demo personalizada sin compromiso</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Implementación rápida y guiada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Soporte dedicado para tu primer evento</span>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Empresa / Venue</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Nombre del venue o evento"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full mt-6">
                  Agenda tu demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
