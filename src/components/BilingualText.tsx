import { useTranslation } from 'react-i18next';
import './BilingualText.css';

interface BilingualTextProps {
  translationKey: string;
  className?: string;
  showAll?: boolean; // If true, shows all three languages
}

export default function BilingualText({ translationKey, className = '', showAll = false }: BilingualTextProps) {
  const { i18n } = useTranslation();

  const getTrilingual = (key: string) => {
    const currentLang = i18n.language;
    i18n.changeLanguage('en');
    const en = i18n.t(key);
    i18n.changeLanguage('am');
    const am = i18n.t(key);
    i18n.changeLanguage('om');
    const om = i18n.t(key);
    i18n.changeLanguage(currentLang);
    return { en, am, om };
  };

  const { en, am, om } = getTrilingual(translationKey);

  if (showAll) {
    return (
      <span className={`bilingual-text trilingual ${className}`}>
        <span className="text-en">{en}</span>
        <span className="text-separator"> / </span>
        <span className="text-am">{am}</span>
        <span className="text-separator"> / </span>
        <span className="text-om">{om}</span>
      </span>
    );
  }

  // Default: Show English and current language
  const currentLang = i18n.language;
  return (
    <span className={`bilingual-text ${className}`}>
      <span className="text-en">{en}</span>
      <span className="text-separator"> / </span>
      {currentLang === 'am' && <span className="text-am">{am}</span>}
      {currentLang === 'om' && <span className="text-om">{om}</span>}
      {currentLang === 'en' && <span className="text-am">{am}</span>}
    </span>
  );
}

