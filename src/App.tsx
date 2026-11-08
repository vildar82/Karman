import { useRef, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import '@excalidraw/excalidraw/index.css';
import brandIcon from '../assets/brand/karman-icon.svg';
import { formatNoteCount, messages } from './i18n';
import type { Language } from './i18n';
import { createBrowserNotesApi } from './notes/api';
import type { Note, NotesApi } from './notes/api';

const notesApi = createBrowserNotesApi(localStorage);

function NoteEditor({ note, language, api, onBack }: {
  note: Note; language: Language; api: NotesApi; onBack: () => void;
}) {
  const text = messages[language];
  const lastSaved = useRef(JSON.stringify(note.document.elements));
  const currentElements = useRef(note.document.elements);
  const [error, setError] = useState(false);

  function save(elements: readonly ExcalidrawElement[]) {
    currentElements.current = elements;
    const serialized = JSON.stringify(elements);
    if (serialized === lastSaved.current) {
      setError(false);
      return;
    }
    try {
      api.save(note.id, { version: 1, elements });
      lastSaved.current = serialized;
      setError(false);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="editor">
      <header className="editor-header">
        <button type="button" disabled={error} onClick={onBack}>{text.backToNotes}</button>
        <strong>{note.title}</strong>
        {error && <><span role="alert">{text.storageError}</span>
          <button type="button" onClick={() => save(currentElements.current)}>{text.retry}</button></>}
      </header>
      <div className="canvas">
        <Excalidraw initialData={{ elements: note.document.elements }}
          langCode={language === 'ru' ? 'ru-RU' : 'en'}
          UIOptions={{ tools: { image: false } }} onChange={save} />
      </div>
    </div>
  );
}

export function App({ language }: { language: Language }) {
  const text = messages[language];
  const [notes, setNotes] = useState(() => notesApi.list());
  const [openNote, setOpenNote] = useState<Note>();
  const [error, setError] = useState(false);

  function createNote() {
    try {
      setOpenNote(notesApi.create(text.untitledNote));
      setError(false);
    } catch {
      setError(true);
    }
  }

  if (openNote) {
    return <NoteEditor key={openNote.id} note={openNote} language={language} api={notesApi} onBack={() => {
      setNotes(notesApi.list());
      setOpenNote(undefined);
    }} />;
  }

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
          <span className="note-count">{formatNoteCount(notes.length, language)}</span>
          <button type="button" onClick={createNote}>{text.createNote}</button>
        </div>
        {error && <p role="alert">{text.storageError}</p>}
        {notes.length === 0 ? (
          <section className="empty-state" aria-labelledby="empty-title">
            <div className="empty-icon" aria-hidden="true">
              <img src={brandIcon} alt="" width="88" height="88" />
            </div>
            <h2 id="empty-title">{text.emptyTitle}</h2>
            <p>{text.emptyDescription}</p>
          </section>
        ) : (
          <ul className="note-list">
            {notes.map((note) => <li key={note.id}>
              <button type="button" onClick={() => setOpenNote(notesApi.get(note.id))}>{note.title}</button>
            </li>)}
          </ul>
        )}
      </main>
    </div>
  );
}