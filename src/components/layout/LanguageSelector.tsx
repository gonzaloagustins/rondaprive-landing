import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGS, swapLangInPath, type Lang } from '@/i18n/routes';

const languageMeta: Record<Lang, { flag: string; name: string }> = {
  es: { flag: '🇪🇸', name: 'Español' },
  en: { flag: '🇬🇧', name: 'English' },
  pt: { flag: '🇧🇷', name: 'Português' },
  fr: { flag: '🇫🇷', name: 'Français' },
};

interface LanguageSelectorProps {
  variant?: 'desktop' | 'mobile';
}

const LanguageSelector = ({ variant = 'desktop' }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const current = (i18n.language.split('-')[0] as Lang) in languageMeta
    ? (i18n.language.split('-')[0] as Lang)
    : 'es';

  const handleLanguageChange = (lang: Lang) => {
    if (lang === current) return;
    // Swap URL first; the LangGuard effect will call i18n.changeLanguage.
    const target = swapLangInPath(location.pathname, lang);
    navigate(`${target}${location.search}${location.hash}`);
  };

  if (variant === 'mobile') {
    return (
      <div className="flex flex-wrap gap-2 py-2">
        {SUPPORTED_LANGS.map((code) => {
          const meta = languageMeta[code];
          return (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                current === code
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-base">{meta.flag}</span>
              <span>{code.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const currentMeta = languageMeta[current];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <span className="text-base">{currentMeta.flag}</span>
          <span className="text-sm font-medium">{current.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {SUPPORTED_LANGS.map((code) => {
          const meta = languageMeta[code];
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`cursor-pointer ${current === code ? 'text-primary' : ''}`}
            >
              <span className="text-base mr-2">{meta.flag}</span>
              <span className="font-medium mr-2">{code.toUpperCase()}</span>
              <span className="text-muted-foreground text-xs">{meta.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
