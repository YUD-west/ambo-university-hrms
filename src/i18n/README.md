# Internationalization (i18n) Setup

## Overview
The application now supports multiple languages: **English** and **Amharic (አማርኛ)**.

## Features
- ✅ Language switcher in the header
- ✅ Automatic language detection from browser
- ✅ Language preference saved in localStorage
- ✅ Translations for all major components
- ✅ Real-time language switching without page reload

## Supported Languages
1. **English (EN)** - Default language
2. **Amharic (አማርኛ)** - Ethiopian language

## Usage

### For Users
Click the language buttons in the top header:
- 🇬🇧 **EN** - Switch to English
- 🇪🇹 **አማ** - Switch to Amharic

The selected language is automatically saved and will be remembered on your next visit.

### For Developers

#### Adding Translations
1. Edit translation files in `src/i18n/locales/`:
   - `en.json` - English translations
   - `am.json` - Amharic translations

2. Use translations in components:
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('common.welcome')}</h1>;
};
```

#### Translation Keys Structure
```
{
  "common": { ... },      // Common UI elements
  "nav": { ... },         // Navigation items
  "dashboard": { ... },   // Dashboard translations
  "employees": { ... },  // Employee management
  "departments": { ... }, // Department management
  "attendance": { ... }, // Attendance management
  "leaves": { ... },     // Leave management
  "performance": { ... }, // Performance reviews
  "forms": { ... },      // Form submissions
  "admin": { ... },      // Admin panel
  "connection": { ... }  // Connection status
}
```

## Files
- `src/i18n/config.ts` - i18n configuration
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/am.json` - Amharic translations
- `src/components/LanguageSwitcher.tsx` - Language switcher component

## Adding New Languages
1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`)
2. Add the language code to `supportedLngs` in `src/i18n/config.ts`
3. Add a button in `LanguageSwitcher.tsx`
4. Copy structure from `en.json` and translate

## Notes
- Language preference is stored in `localStorage` with key `i18nextLng`
- Default language is English if no preference is set
- Browser language is detected automatically on first visit

