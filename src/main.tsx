import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { getLanguage, messages } from './i18n';
import './styles.css';

const language = getLanguage(
  navigator.language,
  window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code,
);

document.documentElement.lang = language;
document.title = messages[language].appName;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App language={language} />
  </StrictMode>,
);