import type { TFunction } from "i18next";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'bar' | 'food' | 'vip';
  menu: MenuItem[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  country?: string;
  image: string;
  features: ('pickup' | 'seat' | 'preorder')[];
  status: 'active' | 'upcoming';
  description: string;
  vendors: Vendor[];
  category?: 'festival' | 'concert' | 'nightclub' | 'conference' | 'bar';
  rating?: number;
  attendees?: string;
  badgeText?: string;
}

// Static, language-agnostic event data. Translatable copy (description, date
// label, country and the optional badge) is resolved through i18n at render
// time — see `localizeEvents` below. Names of real events, venues and cities
// are proper nouns and intentionally not translated.
const rawEvents: Event[] = [
  {
    id: 'estereo-picnic-2026',
    name: 'Festival Estéreo Picnic 2026',
    date: '',
    venue: 'Parque Simón Bolívar',
    city: 'Bogotá',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    features: ['pickup', 'seat', 'preorder'],
    status: 'active',
    description: '',
    category: 'festival',
    rating: 4.9,
    attendees: '85,000',
    vendors: [
      {
        id: 'bar-central',
        name: 'Bar Central',
        type: 'bar',
        menu: [
          { id: 'b1', name: 'Gin & Tonic Premium', price: 8500, category: 'Cocktails' },
          { id: 'b2', name: 'Aperol Spritz', price: 7500, category: 'Cocktails' },
          { id: 'b3', name: 'Cerveza Artesanal', price: 4500, category: 'Cervezas' },
        ]
      }
    ]
  },
  {
    id: 'copa-libertadores-2026',
    name: 'Final Copa Libertadores',
    date: '',
    venue: 'Estadio Monumental',
    city: 'Buenos Aires',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
    features: ['pickup', 'seat'],
    status: 'active',
    description: '',
    category: 'concert',
    rating: 4.8,
    attendees: '72,000',
    vendors: [
      {
        id: 'cantina',
        name: 'Cantina Norte',
        type: 'food',
        menu: [
          { id: 'cn1', name: 'Choripan', price: 3500, category: 'Clasicos' },
          { id: 'cn2', name: 'Cerveza Quilmes', price: 3000, category: 'Bebidas' },
        ]
      }
    ]
  },
  {
    id: 'tomorrowland-winter-2026',
    name: 'Tomorrowland Winter',
    date: '',
    venue: 'Alpe d\'Huez',
    city: 'Alpe d\'Huez',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    features: ['pickup', 'preorder'],
    status: 'active',
    description: '',
    category: 'festival',
    rating: 4.8,
    attendees: '30,000',
    vendors: [
      {
        id: 'bar-tmrw',
        name: 'Main Bar',
        type: 'bar',
        menu: [
          { id: 't1', name: 'Heineken', price: 6000, category: 'Cervezas' },
        ]
      }
    ]
  },
  {
    id: 'club-prive-madrid',
    name: 'Club Privé Madrid',
    date: '',
    venue: 'Club Privé',
    city: 'Madrid',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
    features: ['pickup', 'seat'],
    status: 'active',
    description: '',
    category: 'nightclub',
    rating: 4.7,
    vendors: [
      {
        id: 'vip-madrid',
        name: 'VIP Lounge',
        type: 'vip',
        menu: [
          { id: 'vm1', name: 'Champagne Moet', price: 45000, category: 'Premium' },
        ]
      }
    ]
  },
  {
    id: 'tech-summit-2026',
    name: 'Tech Summit 2026',
    date: '',
    venue: 'Fira Barcelona',
    city: 'Miami, USA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    features: ['pickup', 'preorder'],
    status: 'upcoming',
    description: '',
    category: 'conference',
    rating: 4.6,
    vendors: [
      {
        id: 'catering-tech',
        name: 'Catering',
        type: 'food',
        menu: [
          { id: 'ct1', name: 'Box Lunch Premium', price: 15000, category: 'Lunch' },
        ]
      }
    ]
  },
  {
    id: 'lollapalooza-chile-2026',
    name: 'Lollapalooza Chile',
    date: '',
    venue: 'Parque Cerrillos',
    city: 'Santiago',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    features: ['pickup', 'preorder'],
    status: 'upcoming',
    description: '',
    category: 'festival',
    rating: 4.8,
    vendors: [
      {
        id: 'bar-lolla',
        name: 'Heineken Bar',
        type: 'bar',
        menu: [
          { id: 'l1', name: 'Heineken Pint', price: 4000, category: 'Cervezas' },
        ]
      }
    ]
  },
];

const localize = (event: Event, t: TFunction): Event => {
  const date = t(`eventsData.${event.id}.date`, { defaultValue: "" });
  const country = t(`eventsData.${event.id}.country`, { defaultValue: "" });
  const description = t(`eventsData.${event.id}.description`, { defaultValue: "" });
  const badgeText = t(`eventsData.${event.id}.badgeText`, { defaultValue: "" });
  return {
    ...event,
    date,
    country: country || undefined,
    description,
    badgeText: badgeText || undefined,
  };
};

export const getEvents = (t: TFunction): Event[] => rawEvents.map((e) => localize(e, t));
export const getActiveEvents = (t: TFunction) => getEvents(t).filter((e) => e.status === "active");
export const getUpcomingEvents = (t: TFunction) => getEvents(t).filter((e) => e.status === "upcoming");
export const getEventById = (id: string, t: TFunction) => {
  const raw = rawEvents.find((e) => e.id === id);
  return raw ? localize(raw, t) : undefined;
};
export const getFeaturedEvents = (t: TFunction) => getEvents(t).slice(0, 3);
export const getHomeEvents = (t: TFunction) => getEvents(t).slice(0, 6);

// Legacy export for callers that don't have a t() handy. Returns events
// without their translatable fields populated.
export const events = rawEvents;
