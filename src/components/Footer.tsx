const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div>
            <h3 className="text-2xl font-bold">
              Ronda <span className="text-gradient-gold">Privé</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tecnología para eventos premium
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cómo funciona
            </a>
            <a href="#beneficios" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Beneficios
            </a>
            <a href="#plataforma" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Plataforma
            </a>
            <a href="#contacto" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contacto
            </a>
          </nav>

          {/* Social / Contact */}
          <div className="text-sm text-muted-foreground">
            © 2025 Ronda Privé. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
