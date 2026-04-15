import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Zap, Armchair, ShoppingBag, ArrowLeft, ArrowRight, UtensilsCrossed, Wine, Crown, Star, Users } from "lucide-react";
import { getEventById } from "@/data/events";
import { useState } from "react";
import type { MenuItem } from "@/data/events";

const featureIcons = { pickup: Zap, seat: Armchair, preorder: ShoppingBag };
const vendorTypeIcons = { bar: Wine, food: UtensilsCrossed, vip: Crown };

const EventDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const event = getEventById(id || '');
  const [activeVendor, setActiveVendor] = useState(0);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t("common.notFound")}</h1>
          <Link to="/eventos" className="text-primary hover:underline">{t("events.backToEvents")}</Link>
        </div>
      </div>
    );
  }

  const vendor = event.vendors[activeVendor];

  const grouped = vendor
    ? vendor.menu.reduce((acc, item) => {
        (acc[item.category] ??= []).push(item);
        return acc;
      }, {} as Record<string, MenuItem[]>)
    : {};

  return (
    <>
      {/* Hero */}
      <section className="pt-20">
        {/* Banner image */}
        <div className="relative w-full h-56 md:h-80 overflow-hidden">
          <img
            src={event.image}
            alt={event.name}
            width={1600}
            height={900}
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="section-container -mt-16 relative z-10 pb-12">
          <Link to="/eventos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />{t("events.backToEvents")}
          </Link>

          <div className="space-y-4">
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                event.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
              }`}>
                {event.status === 'active' ? t("events.active") : t("events.upcoming")}
              </span>

              {event.badgeText && (
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {event.badgeText}
                </span>
              )}

              {event.rating && (
                <span className="flex items-center gap-1 text-sm font-medium">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  {event.rating}
                </span>
              )}

              {event.attendees && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />{event.attendees}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold md:text-5xl">{event.name}</h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{event.date}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.venue}, {event.city}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {event.features.map(f => {
                const Icon = featureIcons[f];
                return (
                  <span key={f} className="flex items-center gap-1.5 text-xs glass-card px-3 py-1.5 rounded-full">
                    <Icon className="w-3.5 h-3.5 text-primary" />{t(`events.features.${f}`)}
                  </span>
                );
              })}
            </div>

            {event.description && (
              <p className="text-muted-foreground max-w-2xl">{event.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Vendors */}
      <section className="pb-24">
        <div className="section-container">
          <h2 className="text-xl font-bold mb-6">{t("events.vendors")}</h2>

          <div className="flex gap-3 mb-8 overflow-x-auto">
            {event.vendors.map((v, i) => {
              const VIcon = vendorTypeIcons[v.type] || Wine;
              return (
                <button key={v.id} onClick={() => setActiveVendor(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeVendor === i ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}>
                  <VIcon className="w-4 h-4" />{v.name}
                </button>
              );
            })}
          </div>

          {vendor && (
            <div className="card-premium p-6 space-y-8">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{cat}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <div key={item.id} className="glass-card rounded-xl p-4 flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                        </div>
                        <span className="text-primary font-bold text-sm shrink-0 ml-4">${item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inline CTA — desktop */}
          <div className="card-premium p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">¿Quieres implementar esto en tu evento?</p>
              <p className="text-sm text-muted-foreground">Conoce la plataforma Ronda Privé</p>
            </div>
            <Link to="/contacto" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 flex items-center gap-2">
              Solicitar Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky CTA — mobile only */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border md:hidden">
        <Link to="/contacto" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold">
          Solicitar Demo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
};

export default EventDetail;
