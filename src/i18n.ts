export type Language = 'ru' | 'en';

type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

interface Messages {
  appName: string;
  notesTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  createNote: string;
  untitledNote: string;
  backToNotes: string;
  storageError: string;
  retry: string;
  noteForms: PluralForms;
}

export const messages: Record<Language, Messages> = {
  ru: {
    appName: 'Карман',
    notesTitle: 'Мои заметки',
    emptyTitle: 'Пока нет заметок',
    emptyDescription: 'Создайте первую заметку, чтобы сохранить мысль, рисунок или схему.',
    createNote: 'Создать заметку',
    untitledNote: 'Новая заметка',
    backToNotes: 'К заметкам',
    storageError: 'Не удалось сохранить заметку',
    retry: 'Повторить',
    noteForms: { one: 'заметка', few: 'заметки', many: 'заметок', other: 'заметки' },
  },
  en: {
    appName: 'Karman',
    notesTitle: 'My notes',
    emptyTitle: 'No notes yet',
    emptyDescription: 'Create your first note to save a thought, a drawing, or a diagram.',
    createNote: 'Create note',
    untitledNote: 'Untitled note',
    backToNotes: 'Back to notes',
    storageError: 'Could not save the note',
    retry: 'Retry',
    noteForms: { one: 'note', other: 'notes' },
  },
};

export function getLanguage(browserLanguage: string, telegramLanguageCode?: string): Language {
  const language = telegramLanguageCode?.trim() || browserLanguage;
  return language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

export function formatNoteCount(count: number, language: Language): string {
  const category = new Intl.PluralRules(language).select(count);
  const forms = messages[language].noteForms;
  return `${count} ${forms[category] ?? forms.other}`;
}

export function formatNoteDate(date: Date, language: Language): string {
  return new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(date);
}