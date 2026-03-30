import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Zap, Armchair, ShoppingBag, ArrowLeft, UtensilsCrossed, Wine, Crown } from "lucide-react";
import { getEventById } from "@/data/events";
import { useState } from "react";

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

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0 -z-10 h-80">
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="section-container pt-12">
          <Link to="/eventos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />{t("events.backToEvents")}
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                event.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
              }`}>
                {event.status === 'active' ? t("events.active") : t("events.upcoming")}
              </span>
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">{event.name}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{event.date}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.venue}, {event.city}</span>
            </div>
            <div className="flex gap-2">
              {event.features.map(f => {
                const Icon = featureIcons[f];
                return (
                  <span key={f} className="flex items-center gap-1.5 text-xs glass-card px-3 py-1.5 rounded-full">
                    <Icon className="w-3.5 h-3.5 text-primary" />{t(`events.features.${f}`)}
                  </span>
                );
              })}
            </div>
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
            <div className="card-premium p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendor.menu.map(item => (
                  <div key={item.id} className="glass-card rounded-xl p-4 flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                    </div>
                    <span className="text-primary font-bold text-sm">${item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EventDetail;
