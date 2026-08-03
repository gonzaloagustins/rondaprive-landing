import { PRODUCT_MODES, type ProductMode } from '@/i18n/routes';

/**
 * Presentation metadata for the four product capabilities.
 *
 * The single source of truth for the URL slug lives in `@/i18n/routes`
 * (PRODUCT_MODE_SLUGS); this file only adds what the UI needs — icon, artwork
 * and copy keys. Everything that renders a capability (the menu, the footer,
 * the /producto hub, the detail pages and the home teaser) reads from here so
 * they can't drift apart.
 *
 * `image` is optional: kitchen operations has no photography yet, so its cards
 * render icon-led instead of image-led.
 */
export interface ProductModeMeta {
  id: ProductMode;
  /** lucide icon name, resolved by the consuming component. */
  icon: string;
  titleKey: string;
  subtitleKey: string;
  seoDescriptionKey: string;
  image?: {
    fallback: string;
    webp: string;
    webp900: string;
    webp600: string;
  };
}

const META: Record<ProductMode, ProductModeMeta> = {
  preorder: {
    id: 'preorder',
    icon: 'Clock',
    titleKey: 'product.preorder.title',
    subtitleKey: 'product.preorder.subtitle',
    seoDescriptionKey: 'product.preorder.seoDescription',
    image: {
      fallback: '/compra-anticipada.jpg',
      webp: '/compra-anticipada.webp',
      webp900: '/compra-anticipada-900w.webp',
      webp600: '/compra-anticipada-600w.webp',
    },
  },
  seat: {
    id: 'seat',
    icon: 'MapPin',
    titleKey: 'product.seat.title',
    subtitleKey: 'product.seat.subtitle',
    seoDescriptionKey: 'product.seat.seoDescription',
    image: {
      fallback: '/seat-delivery.jpg',
      webp: '/seat-delivery.webp',
      webp900: '/seat-delivery-900w.webp',
      webp600: '/seat-delivery-600w.webp',
    },
  },
  pickup: {
    id: 'pickup',
    icon: 'CheckSquare',
    titleKey: 'product.pickup.title',
    subtitleKey: 'product.pickup.subtitle',
    seoDescriptionKey: 'product.pickup.seoDescription',
    image: {
      fallback: '/pickup-express.jpg',
      webp: '/pickup-express.webp',
      webp900: '/pickup-express-900w.webp',
      webp600: '/pickup-express-600w.webp',
    },
  },
  kitchen: {
    id: 'kitchen',
    icon: 'ChefHat',
    titleKey: 'product.kitchen.title',
    subtitleKey: 'product.kitchen.subtitle',
    seoDescriptionKey: 'product.kitchen.seoDescription',
  },
};

export const productModeMeta = (mode: ProductMode): ProductModeMeta => META[mode];

/** Every capability, in menu / footer / hub display order. */
export const productModes: ProductModeMeta[] = PRODUCT_MODES.map((m) => META[m]);
