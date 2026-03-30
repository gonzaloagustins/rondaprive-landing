import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "./pages/Home";

const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Industries = lazy(() => import("./pages/Industries"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Benefits = lazy(() => import("./pages/Benefits"));
const Insights = lazy(() => import("./pages/Insights"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const basename = import.meta.env.MODE === "production" ? "/rondaprive-landing" : "";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<PageLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/eventos" element={<Events />} />
              <Route path="/eventos/:id" element={<EventDetail />} />
              <Route path="/soluciones" element={<Solutions />} />
              <Route path="/industrias" element={<Industries />} />
              <Route path="/como-funciona" element={<HowItWorks />} />
              <Route path="/beneficios" element={<Benefits />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
