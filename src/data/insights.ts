export interface InsightPost {
  id: string;
  titleKey: string;
  excerptKey: string;
  category: 'trends' | 'cases' | 'product' | 'industry';
  date: string;
  image: string;
  readTime: number;
}

export const insights: InsightPost[] = [
  {
    id: 'increase-sales-events',
    titleKey: 'insights.post1.title',
    excerptKey: 'insights.post1.excerpt',
    category: 'cases',
    date: '2026-03-25',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    readTime: 5,
  },
  {
    id: 'future-fnb-tech',
    titleKey: 'insights.post2.title',
    excerptKey: 'insights.post2.excerpt',
    category: 'trends',
    date: '2026-03-20',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    readTime: 7,
  },
  {
    id: 'reduce-queues-stadiums',
    titleKey: 'insights.post3.title',
    excerptKey: 'insights.post3.excerpt',
    category: 'cases',
    date: '2026-03-15',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
    readTime: 4,
  },
  {
    id: 'inventory-management',
    titleKey: 'insights.post4.title',
    excerptKey: 'insights.post4.excerpt',
    category: 'product',
    date: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    readTime: 6,
  },
  {
    id: 'nightclub-innovation',
    titleKey: 'insights.post5.title',
    excerptKey: 'insights.post5.excerpt',
    category: 'industry',
    date: '2026-03-05',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    readTime: 5,
  },
  {
    id: 'pre-purchase-strategy',
    titleKey: 'insights.post6.title',
    excerptKey: 'insights.post6.excerpt',
    category: 'product',
    date: '2026-02-28',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&q=80',
    readTime: 4,
  },
];
