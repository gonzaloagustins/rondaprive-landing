import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt: string;
  logo?: React.ReactNode;
  title: string;
  location: string;
  overview: string;
  date: string;
  badgeText?: string;
  onViewEvent: () => void;
}

const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      logo,
      title,
      location,
      overview,
      date,
      badgeText,
      onViewEvent,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-lg",
          "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2",
          className
        )}
        {...props}
      >
        {/* Background Image with Zoom Effect on Hover */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Content Container */}
        <div className="relative flex h-full flex-col justify-between p-5 text-card-foreground">
          {/* Top Section: Logo + Badge */}
          <div className="flex h-32 items-start justify-between">
            {logo && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-black/20 backdrop-blur-sm">
                {logo}
              </div>
            )}
            {badgeText && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-sm">
                {badgeText}
              </span>
            )}
          </div>

          {/* Middle Section: Details (slides up on hover) */}
          <div className="space-y-3 transition-transform duration-500 ease-in-out group-hover:-translate-y-12">
            <div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="text-sm text-white/80">{location}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 leading-relaxed">
                {overview}
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-white/90">{date}</span>
            </div>
          </div>

          {/* Bottom Section: Button (revealed on hover) */}
          <div className="absolute -bottom-14 left-0 w-full px-5 pb-5 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
            <Button
              onClick={onViewEvent}
              size="sm"
              className="w-full bg-white text-black hover:bg-white/90 rounded-full"
            >
              Ver evento <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
EventCard.displayName = "EventCard";

export { EventCard };
export type { EventCardProps };
