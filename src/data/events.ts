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

export const events: Event[] = [
  {
    id: 'estereo-picnic-2026',
    name: 'Festival Estéreo Picnic 2026',
    date: '28-30 Marzo 2026',
    venue: 'Parque Simón Bolívar',
    city: 'Bogotá',
    country: 'Colombia',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    features: ['pickup', 'seat', 'preorder'],
    status: 'active',
    description: 'El festival de música más grande de Colombia con artistas internacionales.',
    category: 'festival',
    rating: 4.9,
    attendees: '85,000',
    badgeText: 'Más vendido',
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
    date: '15 Noviembre 2026',
    venue: 'Estadio Monumental',
    city: 'Buenos Aires',
    country: 'Argentina',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
    features: ['pickup', 'seat'],
    status: 'active',
    description: 'La gran final de la Copa Libertadores de América.',
    category: 'concert',
    rating: 4.8,
    attendees: '72,000',
    badgeText: 'Todas las funciones',
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
    date: '14-21 Marzo 2026',
    venue: 'Alpe d\'Huez',
    city: 'Alpe d\'Huez',
    country: 'Francia',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    features: ['pickup', 'preorder'],
    status: 'active',
    description: 'La edición invernal del festival más grande del mundo.',
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
    date: 'Todos los fines de semana',
    venue: 'Club Privé',
    city: 'Madrid',
    country: 'España',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
    features: ['pickup', 'seat'],
    status: 'active',
    description: 'La experiencia nocturna más exclusiva de Madrid.',
    category: 'nightclub',
    rating: 4.7,
    badgeText: 'VIP Exclusivo',
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
    date: '3-5 Junio 2026',
    venue: 'Fira Barcelona',
    city: 'Miami, USA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    features: ['pickup', 'preorder'],
    status: 'upcoming',
    description: 'El evento de tecnología e innovación más importante.',
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
    date: '14-16 Marzo 2026',
    venue: 'Parque Cerrillos',
    city: 'Santiago',
    country: 'Chile',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    features: ['pickup', 'preorder'],
    status: 'upcoming',
    description: 'El festival Lollapalooza llega a Chile con lineup internacional.',
    category: 'festival',
    rating: 4.8,
    badgeText: 'Favorito',
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

export const getActiveEvents = () => events.filter(e => e.status === 'active');
export const getUpcomingEvents = () => events.filter(e => e.status === 'upcoming');
export const getEventById = (id: string) => events.find(e => e.id === id);
export const getFeaturedEvents = () => events.slice(0, 3);
export const getHomeEvents = () => events.slice(0, 6);
