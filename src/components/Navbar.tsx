import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : ""
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="text-xl font-bold">
            Ronda <span className="text-gradient-gold">Privé</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cómo funciona
            </a>
            <a href="#beneficios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Beneficios
            </a>
            <a href="#para-quien" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Para quién
            </a>
            <a href="#plataforma" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Plataforma
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Button variant="gold" size="default" asChild>
              <a href="#contacto">Solicitar demo</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a 
                href="#como-funciona" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cómo funciona
              </a>
              <a 
                href="#beneficios" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Beneficios
              </a>
              <a 
                href="#para-quien" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para quién
              </a>
              <a 
                href="#plataforma" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Plataforma
              </a>
              <Button variant="gold" className="mt-4" asChild>
                <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)}>
                  Solicitar demo
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
