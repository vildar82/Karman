import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

export interface NoteDocument {
  version: 1;
  elements: readonly ExcalidrawElement[];
}

export interface Note {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  document: NoteDocument;
}

export interface NotesApi {
  list(): Note[];
  get(id: string): Note | undefined;
  create(title: string): Note;
  save(id: string, document: NoteDocument): Note;
}

export function createBrowserNotesApi(storage: Storage): NotesApi {
  const key = 'karman.notes.v1';
  const read = (): Note[] => JSON.parse(storage.getItem(key) ?? '[]') as Note[];
  const write = (notes: Note[]) => storage.setItem(key, JSON.stringify(notes));

  return {
    list: read,
    get: (id) => read().find((note) => note.id === id),
    create: (title) => {
      const now = new Date().toISOString();
      const note: Note = {
        id: crypto.randomUUID(), title, createdAt: now, updatedAt: now, revision: 0,
        document: { version: 1, elements: [] },
      };
      write([...read(), note]);
      return note;
    },
    save: (id, document) => {
      const notes = read();
      const index = notes.findIndex((note) => note.id === id);
      if (index < 0) throw new Error('Note not found');
      const note = { ...notes[index], document, updatedAt: new Date().toISOString(), revision: notes[index].revision + 1 };
      notes[index] = note;
      write(notes);
      return note;
    },
  };
}