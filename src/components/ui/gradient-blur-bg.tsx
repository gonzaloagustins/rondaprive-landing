import { cn } from "@/lib/utils";

interface GradientBlurBgProps {
  className?: string;
}

export const GradientBlurBg = ({ className }: GradientBlurBgProps) => {
  return (
    <div
      className={cn("absolute inset-x-0 bottom-0 pointer-events-none z-10", className)}
      style={{
        background:
          "linear-gradient(to bottom, transparent 10%, hsl(30 25% 95%) 55%)",
      }}
    />
  );
};
