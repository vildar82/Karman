import { describe, expect, it } from 'vitest';
import { formatNoteCount, formatNoteDate, getLanguage } from './i18n';

describe('getLanguage', () => {
  it('uses the browser language outside Telegram', () => {
    expect(getLanguage('ru-RU')).toBe('ru');
  });

  it.each(['en-US', 'de-DE', ''])('uses English for browser language %s', (language) => {
    expect(getLanguage(language)).toBe('en');
  });

  it('gives the Telegram language priority over the browser language', () => {
    expect(getLanguage('ru-RU', 'en')).toBe('en');
    expect(getLanguage('en-US', 'RU')).toBe('ru');
  });

  it('falls back to the browser language when Telegram provides no language', () => {
    expect(getLanguage('ru-RU', '')).toBe('ru');
    expect(getLanguage('ru-RU', undefined)).toBe('ru');
  });
});

describe('formatNoteCount', () => {
  it.each([
    [0, '0 заметок'],
    [1, '1 заметка'],
    [2, '2 заметки'],
    [5, '5 заметок'],
    [11, '11 заметок'],
    [21, '21 заметка'],
    [22, '22 заметки'],
    [25, '25 заметок'],
  ])('formats %i notes in Russian', (count, expected) => {
    expect(formatNoteCount(count, 'ru')).toBe(expected);
  });

  it.each([
    [0, '0 notes'],
    [1, '1 note'],
    [2, '2 notes'],
  ])('formats %i notes in English', (count, expected) => {
    expect(formatNoteCount(count, 'en')).toBe(expected);
  });
});

describe('formatNoteDate', () => {
  it('formats a date in Russian', () => {
    expect(formatNoteDate(new Date(2026, 10, 8), 'ru')).toBe('8 ноября 2026 г.');
  });

  it('formats a date in English', () => {
    expect(formatNoteDate(new Date(2026, 10, 8), 'en')).toBe('November 8, 2026');
  });
});