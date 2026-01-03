import i18n from '../i18n/config';

export const getBilingualText = (key: string): { en: string; am: string; om?: string } => {
  const currentLang = i18n.language;
  
  // Get English translation
  i18n.changeLanguage('en');
  const enText = i18n.t(key);
  
  // Get Amharic translation
  i18n.changeLanguage('am');
  const amText = i18n.t(key);
  
  // Get Oromo translation
  i18n.changeLanguage('om');
  const omText = i18n.t(key);
  
  // Restore original language
  i18n.changeLanguage(currentLang);
  
  return { en: enText, am: amText, om: omText };
};

export const getBilingualPlaceholder = (key: string): string => {
  const { en, am, om } = getBilingualText(key);
  const currentLang = i18n.language;
  
  if (currentLang === 'am') return `${en} / ${am}`;
  if (currentLang === 'om') return `${en} / ${om}`;
  return `${en} / ${am}`;
};

