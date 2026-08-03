import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * Tablet frame that tilts flat as it scrolls into view (Aceternity's container
 * scroll). Adapted from the original in three ways:
 *  - imports from `motion/react`, the package this project already ships,
 *    instead of pulling in framer-motion as a second animation library;
 *  - the card height is content-driven rather than a fixed h-[40rem], so a tall
 *    child (the dashboard mock) isn't cropped by the screen;
 *  - progress is measured per scroll frame from the live bounding rect instead
 *    of `useScroll({ target })`, whose cached offsets go stale when the child
 *    grows after mount — which pinned the tilt at a constant angle here.
 */
export const ContainerScroll = ({
  titleComponent,
  children,
  className,
  cardClassName,
  screenClassName,
}: {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  screenClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const progress = useEnterProgress(containerRef, !reduceMotion);

  const rotate = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [20, 0]);
  const scale = useTransform(progress, [0, 1], reduceMotion ? [1, 1] : [1.02, 1]);
  const translate = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, -100]);

  return (
    <div
      className={`relative flex items-center justify-center ${className ?? ""}`}
      ref={containerRef}
    >
      <div className="relative w-full" style={{ perspective: "1000px" }}>
        {titleComponent && <Header translate={translate} titleComponent={titleComponent} />}
        <Card
          rotate={rotate}
          scale={scale}
          className={cardClassName}
          screenClassName={screenClassName}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

/**
 * 0 while the element's top sits at the bottom of the viewport, reaching 1 by
 * the time that top has travelled to the middle — so the frame is flat once the
 * visitor is actually looking at it, whatever the element's height.
 */
function useEnterProgress(ref: React.RefObject<HTMLElement>, enabled: boolean) {
  const progress = useMotionValue(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) {
      progress.set(1);
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const span = window.innerHeight / 2;
      const p = (window.innerHeight - top) / span;
      progress.set(Math.min(1, Math.max(0, p)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, enabled, progress]);

  return progress;
}

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  className,
  screenClassName,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className={`mx-auto w-full rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:p-4 ${
        className ?? ""
      }`}
    >
      <div
        className={`h-full w-full overflow-hidden rounded-2xl ${screenClassName ?? "bg-gray-100"}`}
      >
        {children}
      </div>
    </motion.div>
  );
};
