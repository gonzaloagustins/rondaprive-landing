
# Plan: Multi-language Support (ES, EN, PT, FR)

## Overview
Implement internationalization (i18n) for Ronda Prive with automatic language detection and manual switching capability. The site will support Spanish (default), English, Portuguese, and French.

---

## Implementation Approach

### 1. Install Dependencies
Add the required i18n libraries:
- `i18next` - Core internationalization framework
- `react-i18next` - React bindings for i18next
- `i18next-browser-languagedetector` - Automatic browser language detection

### 2. Create Translation Files Structure
```text
public/
  locales/
    es/
      translation.json
    en/
      translation.json
    pt/
      translation.json
    fr/
      translation.json
```

Each translation file will contain all text strings organized by component/section.

### 3. Configure i18n System
Create `src/i18n/index.ts` with:
- Language detection from browser settings
- Fallback to Spanish (LATAM neutral)
- Support for all four languages
- Persistence of user's language choice in localStorage

### 4. Language Selector Component
Create a dropdown in the Navbar that:
- Shows current language with flag/abbreviation
- Allows users to switch languages manually
- Persists selection across sessions
- Works on both desktop and mobile views

### 5. Update All Components
Wrap text content with translation hooks in:
- HeroSection (badge, headline, subheadline, buttons, stats)
- Navbar (navigation items, CTA)
- HowItWorksSection (header, steps)
- BenefitsSection (header, benefit cards)
- TargetAudienceSection (header, audience cards)
- PlatformSection (header, features, dashboard labels)
- DifferentiatorsSection (header, comparison table, stats)
- SocialProofSection (testimonial, attribution)
- CTASection (header, form labels, buttons)
- Footer (tagline, navigation, copyright)

---

## Technical Details

### i18n Configuration
```text
src/i18n/
  index.ts         # i18n initialization and config
```

Detection order:
1. localStorage (user's previous choice)
2. Browser navigator language
3. HTML lang attribute
4. Fallback to Spanish

### Language Selector Design
- Minimal dropdown aligned with the dark premium aesthetic
- Desktop: positioned in navbar before the CTA button
- Mobile: included in the mobile menu
- Uses language codes: ES, EN, PT, FR

### Translation Key Structure
Keys will be organized by section for maintainability:
```text
{
  "navbar": { ... },
  "hero": { ... },
  "howItWorks": { ... },
  "benefits": { ... },
  "targetAudience": { ... },
  "platform": { ... },
  "differentiators": { ... },
  "socialProof": { ... },
  "cta": { ... },
  "footer": { ... }
}
```

---

## Files to Create
1. `src/i18n/index.ts` - i18n configuration
2. `public/locales/es/translation.json` - Spanish translations
3. `public/locales/en/translation.json` - English translations
4. `public/locales/pt/translation.json` - Portuguese translations
5. `public/locales/fr/translation.json` - French translations
6. `src/components/LanguageSelector.tsx` - Language switcher component

## Files to Modify
1. `src/main.tsx` - Import i18n configuration
2. `src/components/Navbar.tsx` - Add LanguageSelector
3. `src/components/HeroSection.tsx` - Use useTranslation hook
4. `src/components/HowItWorksSection.tsx` - Use useTranslation hook
5. `src/components/BenefitsSection.tsx` - Use useTranslation hook
6. `src/components/TargetAudienceSection.tsx` - Use useTranslation hook
7. `src/components/PlatformSection.tsx` - Use useTranslation hook
8. `src/components/DifferentiatorsSection.tsx` - Use useTranslation hook
9. `src/components/SocialProofSection.tsx` - Use useTranslation hook
10. `src/components/CTASection.tsx` - Use useTranslation hook
11. `src/components/Footer.tsx` - Use useTranslation hook

---

## Implementation Sequence
1. Install npm packages
2. Create i18n configuration
3. Create all translation JSON files with content
4. Create LanguageSelector component
5. Initialize i18n in main.tsx
6. Update each component to use translations
7. Add LanguageSelector to Navbar
