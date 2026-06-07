import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "@/components/layout/PageLayout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ConsentBanner from "@/components/ConsentBanner";
import { useGTMPageview } from "@/hooks/useGTMPageview";
import Home from "./pages/Home";
import {
  DEFAULT_LANG,
  ROUTE_SLUGS,
  SUPPORTED_LANGS,
  isLang,
  type Lang,
} from "@/i18n/routes";

const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Industries = lazy(() => import("./pages/Industries"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Benefits = lazy(() => import("./pages/Benefits"));
const Insights = lazy(() => import("./pages/Insights"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Picks the best language for an unprefixed visit (e.g. "/" or a legacy
 * Spanish slug). Prefers the language i18next already resolved from the
 * browser/localStorage, falling back to the project default.
 */
const detectInitialLang = (resolved: string | undefined): Lang => {
  const base = resolved?.split("-")[0];
  return isLang(base) ? base : DEFAULT_LANG;
};

/** Mounts a route subtree under /:lang and keeps i18next in sync with the URL. */
const LangGuard = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();
  const valid = isLang(lang);

  useEffect(() => {
    if (!valid) return;
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }
  }, [lang, valid, i18n]);

  if (!valid) {
    const target = `/${DEFAULT_LANG}${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

/** Redirects "/" and legacy unprefixed paths to the detected language. */
const RootRedirect = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = detectInitialLang(i18n.language);
  const target = `/${lang}${location.pathname === "/" ? "" : location.pathname}${location.search}${location.hash}`;
  return <Navigate to={target} replace />;
};

/**
 * Renders one <Route> per supported-language slug for the given page,
 * mounted under the /:lang parent. Keeping all locale slugs registered as
 * concrete routes (rather than a single dynamic slug) means React Router
 * stays predictable and 404s still resolve cleanly for typos.
 */
const localizedRoutes = (
  slug: keyof typeof ROUTE_SLUGS,
  element: React.ReactNode,
  child?: { path: string; element: React.ReactNode },
) =>
  SUPPORTED_LANGS.flatMap((lang) => {
    const localSlug = ROUTE_SLUGS[slug][lang];
    const parent = (
      <Route key={`${slug}-${lang}`} path={localSlug} element={element} />
    );
    if (!child) return [parent];
    return [
      parent,
      <Route
        key={`${slug}-${lang}-${child.path}`}
        path={`${localSlug}/${child.path}`}
        element={child.element}
      />,
    ];
  });

const RouterShell = () => {
  useGTMPageview();
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Localized tree: /:lang/... */}
          <Route
            path=":lang/*"
            element={
              <LangGuard>
                <Routes>
                  <Route element={<PageLayout />}>
                    <Route index element={<Home />} />
                    {localizedRoutes("events", <Events />, { path: ":id", element: <EventDetail /> })}
                    {localizedRoutes("solutions", <Solutions />)}
                    {localizedRoutes("industries", <Industries />)}
                    {localizedRoutes("howItWorks", <HowItWorks />)}
                    {localizedRoutes("benefits", <Benefits />)}
                    {localizedRoutes("insights", <Insights />)}
                    {localizedRoutes("faq", <FAQ />)}
                    {localizedRoutes("glossary", <Glossary />)}
                    {localizedRoutes("contact", <Contact />)}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </LangGuard>
            }
          />
          {/* Root + legacy unprefixed paths: redirect to detected language */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouterShell />
      </BrowserRouter>
      <ConsentBanner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
