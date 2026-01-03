import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        title="English"
      >
        🇬🇧 EN
      </button>
      <button
        className={`lang-btn ${i18n.language === 'am' ? 'active' : ''}`}
        onClick={() => changeLanguage('am')}
        title="አማርኛ"
      >
        🇪🇹 አማ
      </button>
      <button
        className={`lang-btn ${i18n.language === 'om' ? 'active' : ''}`}
        onClick={() => changeLanguage('om')}
        title="Afaan Oromoo"
      >
        🇪🇹 OM
      </button>
    </div>
  );
};

export default LanguageSwitcher;

