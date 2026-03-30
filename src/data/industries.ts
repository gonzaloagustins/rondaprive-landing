export interface Industry {
  id: string;
  titleKey: string;
  descriptionKey: string;
  problemKey: string;
  solutionKey: string;
  useCasesKey: string;
  image: string;
  icon: string; // lucide icon name
}

export const industries: Industry[] = [
  {
    id: 'nightclubs',
    titleKey: 'industries.nightclubs.title',
    descriptionKey: 'industries.nightclubs.description',
    problemKey: 'industries.nightclubs.problem',
    solutionKey: 'industries.nightclubs.solution',
    useCasesKey: 'industries.nightclubs.useCases',
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2a?w=800&q=80',
    icon: 'Music',
  },
  {
    id: 'festivals',
    titleKey: 'industries.festivals.title',
    descriptionKey: 'industries.festivals.description',
    problemKey: 'industries.festivals.problem',
    solutionKey: 'industries.festivals.solution',
    useCasesKey: 'industries.festivals.useCases',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    icon: 'Tent',
  },
  {
    id: 'stadiums',
    titleKey: 'industries.stadiums.title',
    descriptionKey: 'industries.stadiums.description',
    problemKey: 'industries.stadiums.problem',
    solutionKey: 'industries.stadiums.solution',
    useCasesKey: 'industries.stadiums.useCases',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
    icon: 'Trophy',
  },
  {
    id: 'bars',
    titleKey: 'industries.bars.title',
    descriptionKey: 'industries.bars.description',
    problemKey: 'industries.bars.problem',
    solutionKey: 'industries.bars.solution',
    useCasesKey: 'industries.bars.useCases',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
    icon: 'Wine',
  },
];
