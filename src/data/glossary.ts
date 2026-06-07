/**
 * Glossary data — display order and category assignment for each term.
 *
 * The actual text (term + definition) lives in src/i18n/locales/*.json under
 * `glossary.terms.<id>.term` and `.definition`, mirrored across all four
 * supported languages. IDs are stable (kebab-case Spanish) so anchor links
 * remain consistent regardless of which locale the user is on.
 *
 * To add a term: declare the id+category here, then add the entry to all four
 * locale JSONs under `glossary.terms.<id>`. The prerender script picks
 * everything up automatically.
 */
export type GlossaryCategory =
  | 'sales'
  | 'venue'
  | 'tech'
  | 'spaces'
  | 'metrics';

export interface GlossaryTerm {
  id: string;
  category: GlossaryCategory;
}

export const GLOSSARY_CATEGORIES: readonly GlossaryCategory[] = [
  'sales',
  'venue',
  'tech',
  'spaces',
  'metrics',
] as const;

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  // Modalidades de venta
  { id: 'compra-anticipada',    category: 'sales' },
  { id: 'compra-y-retiro',      category: 'sales' },
  { id: 'entrega-en-asiento',   category: 'sales' },
  { id: 'fila-digital',         category: 'sales' },
  { id: 'numero-de-orden',      category: 'sales' },
  // Operación de venue
  { id: 'punto-de-venta',       category: 'venue' },
  { id: 'totem-de-autoservicio',category: 'venue' },
  { id: 'carta-digital',        category: 'venue' },
  { id: 'inventario-tiempo-real', category: 'venue' },
  { id: 'dashboard',            category: 'venue' },
  // Tecnología
  { id: 'pwa',                  category: 'tech' },
  { id: 'qr',                   category: 'tech' },
  { id: 'modo-cache',           category: 'tech' },
  { id: 'trazabilidad',         category: 'tech' },
  { id: 'cloud',                category: 'tech' },
  // Tipos de recinto
  { id: 'venue',                category: 'spaces' },
  { id: 'suite',                category: 'spaces' },
  { id: 'palco',                category: 'spaces' },
  { id: 'hospitality',          category: 'spaces' },
  { id: 'festival',             category: 'spaces' },
  { id: 'coffee-shop',          category: 'spaces' },
  // Métricas del negocio
  { id: 'ticket-promedio',      category: 'metrics' },
  { id: 'tiempo-de-espera',     category: 'metrics' },
  { id: 'rotacion-de-barra',    category: 'metrics' },
  { id: 'tasa-de-conversion',   category: 'metrics' },
];
