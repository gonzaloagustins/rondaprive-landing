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
  image: string;
  features: ('pickup' | 'seat' | 'preorder')[];
  status: 'active' | 'upcoming';
  description: string;
  vendors: Vendor[];
}

export const events: Event[] = [
  {
    id: 'neon-nights-2026',
    name: 'Neon Nights Festival',
    date: '2026-04-15',
    venue: 'Arena Santiago',
    city: 'Santiago, Chile',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    features: ['pickup', 'seat', 'preorder'],
    status: 'active',
    description: 'El festival de musica electronica mas grande de Latinoamerica.',
    vendors: [
      {
        id: 'bar-central',
        name: 'Bar Central',
        type: 'bar',
        menu: [
          { id: 'b1', name: 'Gin & Tonic Premium', price: 8500, category: 'Cocktails' },
          { id: 'b2', name: 'Aperol Spritz', price: 7500, category: 'Cocktails' },
          { id: 'b3', name: 'Cerveza Artesanal', price: 4500, category: 'Cervezas' },
          { id: 'b4', name: 'Vodka Red Bull', price: 7000, category: 'Cocktails' },
          { id: 'b5', name: 'Agua Mineral', price: 2000, category: 'Sin Alcohol' },
        ]
      },
      {
        id: 'food-station',
        name: 'Street Food Station',
        type: 'food',
        menu: [
          { id: 'f1', name: 'Burger Smash', price: 6500, category: 'Burgers' },
          { id: 'f2', name: 'Loaded Fries', price: 4500, category: 'Sides' },
          { id: 'f3', name: 'Hot Dog Premium', price: 5000, category: 'Hot Dogs' },
        ]
      }
    ]
  },
  {
    id: 'club-privilege',
    name: 'Club Privilege - Saturday Night',
    date: '2026-04-05',
    venue: 'Privilege Club',
    city: 'Buenos Aires, Argentina',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
    features: ['pickup', 'seat'],
    status: 'active',
    description: 'La noche mas exclusiva de Buenos Aires con DJs internacionales.',
    vendors: [
      {
        id: 'main-bar',
        name: 'Main Bar',
        type: 'bar',
        menu: [
          { id: 'mb1', name: 'Champagne Moet', price: 45000, category: 'Premium' },
          { id: 'mb2', name: 'Whisky Johnnie Walker', price: 12000, category: 'Whisky' },
          { id: 'mb3', name: 'Mojito', price: 8000, category: 'Cocktails' },
          { id: 'mb4', name: 'Fernet con Cola', price: 5500, category: 'Clasicos' },
        ]
      },
      {
        id: 'vip-lounge',
        name: 'VIP Lounge',
        type: 'vip',
        menu: [
          { id: 'v1', name: 'Botella Absolut + Mixer', price: 35000, category: 'Botellas' },
          { id: 'v2', name: 'Bucket 6 Cervezas', price: 18000, category: 'Buckets' },
          { id: 'v3', name: 'Dom Perignon', price: 180000, category: 'Premium' },
        ]
      }
    ]
  },
  {
    id: 'estadio-monumental',
    name: 'River Plate vs Boca Juniors',
    date: '2026-04-20',
    venue: 'Estadio Monumental',
    city: 'Buenos Aires, Argentina',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
    features: ['pickup', 'seat', 'preorder'],
    status: 'upcoming',
    description: 'El superclasico del futbol argentino en el Monumental.',
    vendors: [
      {
        id: 'cantina-norte',
        name: 'Cantina Norte',
        type: 'food',
        menu: [
          { id: 'cn1', name: 'Choripan', price: 3500, category: 'Clasicos' },
          { id: 'cn2', name: 'Hamburguesa Completa', price: 5500, category: 'Burgers' },
          { id: 'cn3', name: 'Cerveza Quilmes', price: 3000, category: 'Bebidas' },
          { id: 'cn4', name: 'Gaseosa', price: 2000, category: 'Bebidas' },
        ]
      }
    ]
  },
  {
    id: 'lollapalooza-ar',
    name: 'Lollapalooza Argentina 2026',
    date: '2026-05-10',
    venue: 'Hipodromo de San Isidro',
    city: 'Buenos Aires, Argentina',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    features: ['pickup', 'preorder'],
    status: 'upcoming',
    description: 'El festival internacional de musica mas importante de Argentina.',
    vendors: [
      {
        id: 'bar-lolla-1',
        name: 'Heineken Bar',
        type: 'bar',
        menu: [
          { id: 'l1', name: 'Heineken Pint', price: 4000, category: 'Cervezas' },
          { id: 'l2', name: 'Heineken 0.0', price: 3500, category: 'Sin Alcohol' },
          { id: 'l3', name: 'Margarita', price: 7500, category: 'Cocktails' },
        ]
      },
      {
        id: 'food-lolla',
        name: 'Food Court',
        type: 'food',
        menu: [
          { id: 'fl1', name: 'Pizza Slice', price: 4000, category: 'Pizza' },
          { id: 'fl2', name: 'Tacos x3', price: 5500, category: 'Mexican' },
          { id: 'fl3', name: 'Wrap Vegano', price: 5000, category: 'Vegano' },
        ]
      }
    ]
  },
  {
    id: 'bar-milano',
    name: 'Milano Bar - Live Jazz',
    date: '2026-04-08',
    venue: 'Milano Bar',
    city: 'Ciudad de Mexico, Mexico',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    features: ['pickup'],
    status: 'active',
    description: 'Noche de jazz en vivo con los mejores cocktails de la ciudad.',
    vendors: [
      {
        id: 'milano-bar',
        name: 'Barra Principal',
        type: 'bar',
        menu: [
          { id: 'mi1', name: 'Old Fashioned', price: 180, category: 'Cocktails' },
          { id: 'mi2', name: 'Negroni', price: 170, category: 'Cocktails' },
          { id: 'mi3', name: 'Mezcal Artesanal', price: 200, category: 'Mezcal' },
          { id: 'mi4', name: 'Cerveza IPA', price: 90, category: 'Cervezas' },
        ]
      }
    ]
  },
  {
    id: 'rock-in-rio-br',
    name: 'Rock in Rio Brasil',
    date: '2026-06-15',
    venue: 'Parque Olimpico',
    city: 'Rio de Janeiro, Brasil',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    features: ['pickup', 'seat', 'preorder'],
    status: 'upcoming',
    description: 'O maior festival de musica do mundo chega ao Rio.',
    vendors: [
      {
        id: 'bar-rock',
        name: 'Rock Bar',
        type: 'bar',
        menu: [
          { id: 'r1', name: 'Caipirinha', price: 25, category: 'Cocktails' },
          { id: 'r2', name: 'Cerveja Brahma', price: 15, category: 'Cervejas' },
          { id: 'r3', name: 'Agua de Coco', price: 10, category: 'Sem Alcool' },
        ]
      }
    ]
  },
];

export const getActiveEvents = () => events.filter(e => e.status === 'active');
export const getUpcomingEvents = () => events.filter(e => e.status === 'upcoming');
export const getEventById = (id: string) => events.find(e => e.id === id);
export const getFeaturedEvents = () => events.slice(0, 3);
