import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

/**
 * Locale switcher: Globe icon + active code + chevron, opening a dropdown
 * of endonyms. No flags — using a country flag to represent a language is
 * culturally wrong for LATAM ("español" ≠ Spain) and a known UX anti-pattern.
 * Visually subdued so the primary CTA in the header stays dominant.
 */
const LanguageSelector = () => {
  const { locale, setLocale, availableLocales } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Select language"
          className="gap-1.5 px-2.5 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
        >
          <Globe className="h-4 w-4" aria-hidden />
          <span className="text-xs font-medium tracking-wide">
            {locale.toUpperCase()}
          </span>
          <ChevronDown
            className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 data-[state=open]:rotate-180"
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[180px]"
      >
        {availableLocales.map(({ code, label }) => {
          const isActive = locale === code;
          return (
            <DropdownMenuItem
              key={code}
              onSelect={() => setLocale(code)}
              aria-current={isActive ? "true" : undefined}
              className={`cursor-pointer justify-between gap-3 ${
                isActive ? "font-medium text-foreground" : "text-foreground/80"
              }`}
            >
              <span lang={code}>{label}</span>
              {isActive ? (
                <Check className="h-4 w-4 text-primary" aria-hidden />
              ) : (
                <span className="h-4 w-4" aria-hidden />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
