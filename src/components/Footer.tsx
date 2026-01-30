import { useTranslation } from "react-i18next";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src={logoRondaPrive} 
              alt="Ronda Privé" 
              className="h-8 w-auto"
              loading="lazy"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("navbar.howItWorks")}
            </a>
            <a href="#beneficios" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("navbar.benefits")}
            </a>
            <a href="#plataforma" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("navbar.platform")}
            </a>
            <a href="#contacto" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("navbar.requestDemo")}
            </a>
          </nav>

          {/* Social / Contact */}
          <div className="text-sm text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;