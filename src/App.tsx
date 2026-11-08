import brandIcon from '../assets/brand/karman-icon.svg';
import { formatNoteCount, messages } from './i18n';
import type { Language } from './i18n';

export function App({ language }: { language: Language }) {
  const text = messages[language];

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src={brandIcon} alt="" width="36" height="36" />
          <span>{text.appName}</span>
        </div>
      </header>

      <main className="notes">
        <div className="notes-heading">
          <h1>{text.notesTitle}</h1>
          <span className="note-count">{formatNoteCount(0, language)}</span>
        </div>

        <section className="empty-state" aria-labelledby="empty-title">
          <div className="empty-icon" aria-hidden="true">
            <img src={brandIcon} alt="" width="88" height="88" />
          </div>
          <h2 id="empty-title">{text.emptyTitle}</h2>
          <p>{text.emptyDescription}</p>
        </section>
      </main>
    </div>
  );
}