import { describe, expect, it } from 'vitest';
import { createBrowserNotesApi } from './api';
import type { NotesApi } from './api';

function notesApiContract(createApi: () => NotesApi) {
  describe('notes API contract', () => {
    it('creates, reads and lists notes', () => {
      const api = createApi();
      const note = api.create('First');
      expect(note.document).toEqual({ version: 1, elements: [] });
      expect(note.revision).toBe(0);
      expect(api.get(note.id)).toEqual(note);
      expect(api.list()).toEqual([note]);
    });

    it('saves a document and increments its revision', () => {
      const api = createApi();
      const note = api.create('First');
      const saved = api.save(note.id, { version: 1, elements: [] });
      expect(saved.revision).toBe(1);
      expect(api.get(note.id)).toEqual(saved);
      expect(api.save(note.id, saved.document).revision).toBe(2);
    });
  });
}

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

notesApiContract(() => createBrowserNotesApi(memoryStorage()));