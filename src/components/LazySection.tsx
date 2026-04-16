import {
  Suspense,
  useRef,
  useState,
  useEffect,
  type LazyExoticComponent,
  type ComponentType,
} from "react";

interface LazySectionProps {
  /** A React.lazy() component to render once the placeholder nears the viewport. */
  component: LazyExoticComponent<ComponentType<unknown>>;
  /**
   * Minimum height for the placeholder so the page doesn't collapse before the
   * real section loads. Prevents CLS and ensures IntersectionObserver can fire
   * for sections further down the page.
   */
  minHeight?: string;
  /**
   * IntersectionObserver rootMargin — how far before the viewport to start
   * loading. 300 px gives the chunk enough time to download and parse on a
   * typical connection so the user never sees the placeholder.
   */
  rootMargin?: string;
  /**
   * Optional section id passed to the placeholder div so hash-based navigation
   * (e.g. /#producto) scrolls to the right spot even before the real component
   * has loaded.
   */
  id?: string;
}

/**
 * Viewport-triggered lazy loader for below-the-fold sections.
 *
 * Renders a lightweight placeholder until IntersectionObserver detects the
 * element is within `rootMargin` of the viewport, then swaps in the real
 * React.lazy component inside Suspense. This means the JS chunk for each
 * section isn't even *downloaded* until the user scrolls near it.
 */
export default function LazySection({
  component: Component,
  minHeight = "24rem",
  rootMargin = "300px",
  id,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (!triggered) {
    return <div ref={ref} id={id} style={{ minHeight }} />;
  }

  return (
    <Suspense fallback={<div id={id} style={{ minHeight }} />}>
      <Component />
    </Suspense>
  );
}
