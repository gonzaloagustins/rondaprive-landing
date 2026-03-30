import React, { useState, useRef, useLayoutEffect, cloneElement, ReactElement } from 'react';

type NavItem = {
  id: string | number;
  icon: ReactElement;
  label?: string;
  onClick?: () => void;
};

type LimelightNavProps = {
  items: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
};

const LimelightNav = ({
  items,
  defaultActiveIndex = 0,
  onTabChange,
  className = '',
}: LimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;
    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;
      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) return null;

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav className={`relative inline-flex items-center h-14 rounded-xl glass px-2 ${className}`}>
      {items.map(({ id, icon, label, onClick }, index) => (
        <button
          key={id}
          ref={el => { navItemRefs.current[index] = el; }}
          className="relative z-20 flex h-full cursor-pointer items-center justify-center px-5"
          onClick={() => handleItemClick(index, onClick)}
          aria-label={label}
        >
          {cloneElement(icon, {
            className: `w-5 h-5 transition-opacity duration-200 ${
              activeIndex === index ? 'opacity-100 text-primary' : 'opacity-40'
            } ${icon.props.className || ''}`,
          })}
        </button>
      ))}
      <div
        ref={limelightRef}
        className={`absolute top-0 z-10 w-10 h-[4px] rounded-full bg-primary ${
          isReady ? 'transition-[left] duration-300 ease-in-out' : ''
        }`}
        style={{ left: '-999px' }}
      >
        <div className="absolute left-[-30%] top-[4px] w-[160%] h-12 [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)] bg-gradient-to-b from-primary/25 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
};

export { LimelightNav };
export type { NavItem, LimelightNavProps };
