import React, { useState, useEffect, useRef, useCallback } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ContainerTextFlipProps {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 500,
}: ContainerTextFlipProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);
  const [animKey, setAnimKey] = useState(0);
  // Measurer lives INSIDE the container so it inherits italic, font-size, etc.
  const measureRef = useRef<HTMLSpanElement>(null);

  const updateWidth = useCallback(() => {
    if (measureRef.current) {
      setContainerWidth(measureRef.current.offsetWidth + 56);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(updateWidth, 50);
    return () => clearTimeout(t);
  }, [currentWordIndex, updateWidth]);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      setAnimKey((prev) => prev + 1);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);

  const currentWord = words[currentWordIndex];

  return (
    <>
      <style>{`
        @keyframes wordFadeIn {
          from { opacity: 0; filter: blur(8px); transform: translateY(4px); }
          to   { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        .word-flip-text {
          background-image: linear-gradient(135deg, #D5A85A 0%, #E8C97A 50%, #D5A85A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .word-flip-animate {
          animation: wordFadeIn var(--flip-duration, 500ms) ease both;
        }
      `}</style>

      <span
        className={cn(
          "relative inline-block rounded-2xl pt-2 pb-3 text-center font-bold overflow-visible",
          "[background:linear-gradient(to_bottom,rgba(255,255,255,0.85),rgba(245,240,235,0.7))]",
          "shadow-[inset_0_-1px_rgba(213,168,90,0.4),inset_0_0_0_1px_rgba(213,168,90,0.25),0_4px_12px_rgba(213,168,90,0.15)]",
          className
        )}
        style={{
          width: containerWidth !== undefined ? `${containerWidth}px` : undefined,
          transition: `width ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          "--flip-duration": `${animationDuration}ms`,
        } as React.CSSProperties}
      >
        {/* Hidden measurer: inside container so it inherits font-size, italic, etc. */}
        <span
          aria-hidden="true"
          ref={measureRef}
          className={cn("invisible absolute whitespace-nowrap pointer-events-none", textClassName)}
        >
          {currentWord}
        </span>

        {/* Visible animated text */}
        <span
          key={animKey}
          className={cn("inline-block whitespace-nowrap pr-[0.15em] pb-[0.15em] word-flip-text word-flip-animate", textClassName)}
        >
          {currentWord}
        </span>
      </span>
    </>
  );
}

export default ContainerTextFlip;
