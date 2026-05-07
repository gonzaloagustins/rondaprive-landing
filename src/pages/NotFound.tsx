import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/shared/SEO";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO title="Página no encontrada" noIndex />
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 section-container">
        <h1 className="text-7xl font-bold text-gradient-gold">404</h1>
        <h2 className="text-2xl font-bold">{t("common.notFound")}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">{t("common.notFoundMessage")}</p>
        <Button variant="gold" asChild>
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />{t("common.goHome")}</Link>
        </Button>
      </div>
    </div>
    </>
  );
};

export default NotFound;
