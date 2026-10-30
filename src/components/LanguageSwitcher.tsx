import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    localStorage.setItem('currentLanguage', lng);
  };

  return (
    <div className="language-switcher" role="group" aria-label="Language Selector">
      <button
        type="button"
        className={`lang-btn ${currentLang.startsWith('en') ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        title="English (Default)"
        aria-pressed={currentLang.startsWith('en')}
      >
        🇬🇧 EN
      </button>
      <button
        type="button"
        className={`lang-btn ${currentLang.startsWith('om') ? 'active' : ''}`}
        onClick={() => changeLanguage('om')}
        title="Afaan Oromoo"
        aria-pressed={currentLang.startsWith('om')}
      >
        🇪🇹 OM
      </button>
      <button
        type="button"
        className={`lang-btn ${currentLang.startsWith('am') ? 'active' : ''}`}
        onClick={() => changeLanguage('am')}
        title="አማርኛ"
        aria-pressed={currentLang.startsWith('am')}
      >
        🇪🇹 አማ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
